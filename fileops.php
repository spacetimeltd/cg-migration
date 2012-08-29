<?php
date_default_timezone_set('America/New_York');
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

if(!is_dir("output")){
    if( !mkdir("output") ){
        die('failed to create "output" directory');
    }
}
$outDir = "output";

if(isset($_POST['verbose'])) {
    $v = true;
} else {
    $v = false;
    //$v = true;
}
// debug output
if($v){
    $source = $_POST['source'];
    $target = $_POST['target'];
    $itr = 0;
    foreach($source as $from) {
        $tout .= "Source: ".$from."     @@@     to".$target[$itr]."\n";
        $itr++;
    }

    if(file_put_contents("debug_output", $tout."\n")) {
        echo 'output to debug_ouput is complete\n';
    } else {
        echo 'failed again';
    }
}


if(isset($_POST['id'])){
    $fname = $outDir.DS.$_POST['id'];
} else {
    $fname = $outDir.DS.$_POST['name'];
}
//if this page has been requested than:
$mode = $_POST['mode'];

// The File Outputer
// ***********************************************************

switch ($mode) {
case 'fileJSON2':
    $fname = $_POST['name'];
    $text = ($_POST['text']);
    $text = implode("\n",$text);
    if(file_put_contents($fname,$text)) {
        echo $fname." successfully written to disk\n";
    } else {
        echo $fname." failed to write\n";
    }
break;
case 'fileJSON':
    $fname = $_POST['name'];
    $text = ($_POST['text']);

    $text = implode("\n",$text);
    $text = mb_convert_encoding($text,"Windows-1252","UTF-8");
    if(file_put_contents($fname,$text)) {
        echo $fname." successfully written to disk\n";
    } else {
        echo $fname." failed to write\n";
    }
break;
case 'file':
    $fname = $_POST['name'];
    $text = implode("\n",$_POST['text']);
    if(file_put_contents($fname,$text)) {
        echo $fname." successfully written to file\n";
    } else {
        echo $fname." failed to write\n";
    }
break;

case 'getfile':
    $fname = $_POST('name');
    $text = json_encode(file("postPostProcessing/".$fname));
    //$text = mb_convert_encoding($text, "UTF-8", "Windows-1252");
    echo $text;

    break;

case 'input':
    $fname = $_POST['id'];
    $text = file_get_contents($fname);
    $text = mb_convert_encoding($text,"UTF-8","Windows-1252");
    echo $text;

    break;

//The Output Section
//************************************************************
case 'output':
    $fname = $_POST['id'].".csv";
    $text = $_POST['txt'];

    $matches = array();
    if(preg_match_all("/members\/[^\"]*?\"/i",$text,$matches)
     && $matches)
    {
        $err_output = implode("\n",array_values($matches));
        echo $err_output;
    }

    $text = mb_convert_encoding($text, "Windows-1252", "UTF-8");
    if(file_put_contents($fname,$text)) {
        echo $fname.
            "  <--converted to Code Page 1252 and written to file\n\n";
    } else {
        echo "\n".$fname.' <--failed to write to file'."\n\n";
    }

    break;

// The Debug Area
// ***********************************************************
default:
    echo 'go post proc debug diagnostics';

    $source = file("source",FILE_IGNORE_NEW_LINES);
    $target = file("target",FILE_IGNORE_NEW_LINES);
    $upldHash = file("upldHash",FILE_IGNORE_NEW_LINES);
    $uploaded = file("uploaded",FILE_IGNORE_NEW_LINES);
    $solPics = file("solPics",FILE_IGNORE_NEW_LINES);

    for ($i = 0; $i < count($source); $i++) {
        $source[$i] = "/".preg_quote($source[$i],"/")."/";
        $target[$i] = "/".preg_quote($target[$i],"/")."/";
    }

    $arrFnames = array("products","features",
                "options","categories");
    $fname = $arrFnames[0];
    $text = file_get_contents($fname);

    $max = count($source);
    for($i=0;$i<$max;$i++){
        $text = preg_replace($source[$i],$target[$i],$text);
    }
    file_put_contents('products.processed.txt',$text);

    $text2 = file_get_contents($fname);
    $text2 = preg_replace($source,$target,$text2);
    file_put_contents('products.processed2.txt',$text2);
//        $text2 = preg_replace("/http:\/\/)

break;
}

function fcon() {
    if(isset($_GET['convert'])) {
        $fname = $_GET['filename'];
        $utf8 = isset($_GET['utf8']);

        if(file_exists($fname)) {
            $fcontent = file_get_contents($fname);
            if($utf8) {
                $fcontent = utf8_encode($fcontent);
            } else {
                $fcontent = utf8_decode($fcontent);
            }
            if(file_put_contents($fname,implode("\n",$fcontent))) {
                if($verbose) echo "success<br>";
            }
            else echo "failed to write to file: ".$fname;
        }
    }
}



?>
