<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <title>The Wright Tool</title>

    <SCRIPT src="jq.js"></SCRIPT>
    <SCRIPT src="jq2.js"></SCRIPT>
    <SCRIPT src="pp.js"></SCRIPT>


    <script src="scraper.js"></script>
    <script src="mapper.js"></script>


    <style type='text/css'>
    html{height:100%}
    body {height:100%;min-height:100%;margin: 5px 10px 5px 0px;padding:5px 10px 5px 5px}
   p.indent { margin: 2em; height: 1.2em }
    a:link, a:active, a:visited { color: yellow; background-color: black }

   div.container { height:auto; margin: 5px 10px 5px 5px; padding: 5px 5px 5px 5px;; border: 1px solid #000000;
                    width: 100%; overflow: hidden   }
    .left { width: 50%; float: left; }
    .right {    width: 50%; float: right; }
    div.output { border: 1px solid gray; padding: 5px; font-weight: 650 }

    .hidden { height:0px; overflow:hidden }
    #top { }
    #panic {float:right; padding: 0px 0px 10px 5px;}
    #todo {margin: 1em}
    #result2 { }
    #topper { margin: 5px 5px 5px 10px ;}

    div.output { border: 1px solid gray; padding: 5px; background-color: black; color: yellow; overflow:scroll; }




    </style>
</head>

<body>
    <div id=top>
        <strong id=todo></strong>
        <strong id=panic onClick="stopTimeLoop()">click here to abort</strong>
    </div>
    <div id=topper></div>
    <div class=container id=wrapper>
        <div id=result0 class=output ondblclick="resize(this);"><div id="xtra"></div></div>
        <div class=left>
            <div class=output id=result1 ondblclick="resize(this);"></div>
        </div>
        <div class=right>
            <div class=output id=result2 ondblclick="resize(this);"></div>
        </div>
    </div>
    <div style="width: 100%" id=links></div>


    <script type="text/javascript" src="functions.js"></script>

</body>

</html>
