<?php
//ob_start();
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

date_default_timezone_set('America/New_York');
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

if(empty($_GET) || (!isset($_GET['url']))) {
    $errmsg = "<script>alert('No Url! This API requires an URL as a parameter.";
    $errmsg .= "\\n\t Example: utils.php?url=blahblah');</script>";
    echo($errmsg);
}

$url = $_GET['url'];
$pattern = '/_1space_/';
if(preg_match($pattern, $url)) {
    $url = preg_replace($pattern, "%20", $url);
}

if(isset($_GET['verbose'])) { $verbose = true; }
else $verbose = false;

if($verbose) echo '__FILE__ : '.__FILE__ . "<br />";
if($verbose) echo '__LINE__ : '.__LINE__ . "<br />";
if($verbose) echo '__DIR__ : '.__DIR__ . "<br />";

$matches = array();                                                     if($verbose) {echo " if we're using a monolithic cache...<br>";}
$pattern = '/http:\/\/([A-Za-z0-9-]+\.[A-Za-z0-9-]+\.[A-Za-z0-9-]+)/';  if($verbose) {echo "pattern = ".$pattern."<br>";}

preg_match($pattern, $url,$matches);                                    if($verbose) {echo "matches = "; print_r($matches); }
$urlbase = $matches[1];
$filebase = ".".DS.$urlbase;                                            if($verbose) {echo "<br>filebase = ".$filebase."<br>";}

if($verbose) echo "checking if the requested url's file data is aready in the cache<br>";
$output = isInCacheAlready($url);

if($output === 0) {                                                                             // not already cached

    if($verbose) echo "Not already cached, trying to get the remote file<br>";
    if($verbose) echo "url to retreive is: ".$url."<br>";
    $filetext = file($url, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);      // getting the remote file
    if( !$filetext ) {                                                                      // request failed
        $errmsg = "//file(".$url.") failed! ";                                              // composing error msg
        $errmsg .= "Could be url--> ".$url."  <-- is malformed.";
        $errmsg .= "Or SOL is rejecting requests.";                                     // we send back a json encoded array
        $response[] = $errmsg;                                                                  // so here we push the msg
        $response[] = 'failed';                                                                 // and set the flag for the receiver
        $output = json_encode($response);                                                   // and json encode it for transfer
        if($verbose) echo $errmsg;
    } else {
                                                                                    if($verbose) echo "file(...) returned: ".$filetext."<br>";
        if( isset($_GET['pIndex'])) {
            $response[] = $_GET['pIndex'];
        }

        $output = implode("\n",$filetext);                              if($verbose) echo "replacing original line delimiter with \\n<br>";
        $output = mb_convert_encoding($output,"UTF-8","Windows-1252");     if($verbose) echo "converting to utf8 encoding, assumes cp-1252 encoding<br>";
        $response = explode("\n", $output);                              if($verbose) echo "exploding the processed text to the response array<br>";
        $response[] = $url;                                                 if($verbose) echo "the url is always last tacked on the end <br>";
        $output = json_encode($response);

        if(file_put_contents($filebase.".data",$url.",".$output."\n",FILE_APPEND)) {
            if($verbose) echo "successfully wrote to ".$filebase.".data<br>";
        } else echo "failed to write to file: ".$filebase.".data<br>";
        if (file_put_contents($filebase.".index",$url."\n",FILE_APPEND)) {
            if($verbose) echo "successfully wrote to ".$filebase.".index<br>";
        } else echo "failed to write to file: ".$filebase.".index<br>";
    }
}

if( isset($_GET['callback']) ) {
    $callback = $_GET['callback'];                                                          // this names the callback function
    $output = preg_replace('/\.google\./i',"<!--google-removed-->",$output);                // this is to get rid of google urls until later
    $output = preg_replace('/\.gstatic\./i',"<!--gstatic-removed-->",$output);              // luckily this works on the json
    //    $output = preg_replace('/<script/i',"<!--script-removed--", $output);                   // scripts keeping crashing jquery
//    $scripts_pattern = '/<script[\s\S]*?\/script>/';
//    $noscript_patter = '/<!--noscript[\s\S]*?\/noscript>'
//    $output = preg_replace()
    //$output = json_decode($output);
    //$output = preg_replace('/src="\//i','src="http://'.$urlbase."/",$output);
    //$output = preg_replace('/href="\//i','href="http://'.$urlbase."/",$output);
    //$output = preg_replace('/background="\//i','background="http://'.$urlbase."/",$output);
    //$output = preg_replace("/src='\//i","src='http://".$urlbase."/",$output);
    //$output = preg_replace("/href='\//i","href='http://".$urlbase."/",$output);
    //$output = preg_replace("/background='\//i","background='http://".$urlbase."/",$output);
//    $output = utf8_decode($output);
//    $output = mb_convert_encoding($output,"UTF-8","Windows-1252");
//    $output = preg_match_all(
    //$output = json_encode($output);


    echo $callback."(" . $output . ");";
}

function process_ouput($output) {
    global $url;
    $matches = array();
    $pattern = '/(http:\/\/[A-Za-z0-9-]+\.[A-Za-z0-9-]+\.[A-Za-z0-9-]+)/';
    echo "did we get this far";
    preg_match($pattern,$url,$matches);
    $root = $matches[1];
    echo "this is the root of the problem: ".$root;
//    $test = preg_replace('/<.*?\/.*?\..*?\>>/')
    $test = preg_replace('/"\//ig','"'.$root."/",$output);
    echo "This is a test ".$test."\n";
    return $test;
}

function isInCacheAlready($newUrl) {
    global $filebase;
    global $verbose;

    if($verbose) echo "searching cache<br>";
    if($verbose) echo "opening file".$filebase.".index"."<br>";

    $file = fopen($filebase.".index",'r');
    if ($file) {
        if($verbose) echo "opened file<br>";
        $lineCounter = 0;
       while (($oldUrl = fgets($file)) !== false) {

        if($verbose) echo $oldUrl."<br>";
        $oldUrl = rtrim($oldUrl);

            if($verbose) echo "matching url to find ".$newUrl." against ".$oldUrl.".<br>";
            if(strcasecmp($oldUrl, $newUrl)==0) {
                fclose($file);

                if($verbose) echo "matched it<br>";
                if($verbose) echo "opening file ".$filebase.".data"."<br>";

                $file = fopen($filebase.".data",'r');

                if(!$file) echo "failed to open: ".$filebase."<br>";

                while($lineCounter>0) {
                    fgets($file);
                    if($verbose) echo $lineCounter."<br>";
                    if($verbose) echo substr($found,0,strlen($oldUrl)+1)."<br>";
                    $lineCounter--;
                }
                $found = fgets($file);
                if($verbose) echo "found: ".$found."<br>";
                $found = substr($found,strlen($oldUrl)+1);
                if(!$file) echo "returning: ".$found."<br>";

                fclose($file);
                return $found;
            }
        $lineCounter++;
        }
    fclose($file);
    }

    return 0;
}


?>
