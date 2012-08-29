function writeConsole(content) {
    top.consoleRef=window.open('','myconsole',
     'width=350,height=250'
      +',menubar=0'
      +',toolbar=1'
      +',status=0'
      +',scrollbars=1'
      +',resizable=1');
    top.consoleRef.document.writeLn(
     '<html><head><title>Console</title></head>'
      +'<body bgcolor=white onLoad="self.focus()">'
      +content
      +'</body></html>'
    );
    top.consoleRef.document.close();
}


function encodeRE(s){ // often mistaken for Script.encodeRE
//    return s.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

function hashit(s) {
     for(var x in s) {
        if(s.hasOwnProperty(x)) {
            window.sHash = s[x];
        }
    }
}

function finishIt() {
    for( i in site.solPics) {
         $("#result0").prepend(site.solPics[i]+" <br> ");
    }
}

function resize(caller) {
    var fixedHeight = "366px";
    var style = caller.style;
    if(style.height == 'auto' | style.height === "") {
        style.height = fixedHeight;
        style.minHeight = fixedHeight;
    } else {
        style.height = 'auto';
        style.minHeight = "";
    }
}

var site;
var script;
var debug;
var specson;
var getProductTMPs;

// the homemade event monitor
function checkStatus() {

    if((ajaxCallbacks.root == true)) {
        if(!checklist.root){
            s1t1=setTimeout("s1timers?checklist.root = 1:checklist.root = 'done';",2000);
            $("#todo").html("<strong onClick='moveOn(1);clearTimeout(s1t1);'>Top level javascript encrypted URLs aquired and decoded!</strong>");
        }
        if(checklist.root==1){
            s1t2=setTimeout("s1timers?checklist.root = 0:checklist.root = 'done';",2500);
            $("#todo").html("<strong onClick='moveOn(1);clearTimeout(s1t2);'>Click here to begin recursive site crawl!</strong>");
        }
    }
    if((ajaxCallbacks.toplevel == true)) {
        if(!checklist.toplevel){
            $("#todo").html("<strong onClick='moveOn(2)'>All page data has been retrieved and processed.</strong>");
            setTimeout("if(checklist.toplevel!='done') checklist.toplevel = 1",2000);
        }
        if(checklist.toplevel==1){
            $("#todo").html("<strong onClick='moveOn(2)'>Click here to generate the CSV Import files for 3dcart!</strong>");
            setTimeout("if(checklist.toplevel!='done') checklist.toplevel = 0",2500);
        }
    }

    if((ajaxCallbacks.gencsv == true)) {
        if(!checklist.gencsv){
            $("#todo").html("<strong onClick='moveOn(3)'>Click here to generate the CSV Import files for 3dcart!</strong>");
            checklist.gencsv = 'done';

              finishIt();

        }
    }
}

// the staging engine

var retryUrl;
var stage = 0;
var s1timers = true;
var s1t1;
var s1t2;
function moveOn(stage) {

    if(stage==1) {
        s1timers = false;
        checklist.root = 'done';
//        alert("Beginning site crawl with page:\n\n\t "+site.pageUrlByIndex[0]);
        $("#todo").html("<strong>Working...</strong>");
        site.initSiteCrawl(site.pageUrlByIndex[0]);
        stage=0;
    }

    if(stage==2) {
        stage=0;
        $('#topper').html(
            '<div ><div id=hiderl class=left>'+
            '<div><br><p onclick="">Input     </p></div>'+
                '<textarea cols=70 rows=4 id=input></textarea>'+
                '<div><p onclick="">Product Import CSV</p></div><textarea cols=70 rows=4 id=products></textarea>'+
                '<div><p onclick="">Product Options CSV</p></div><textarea cols=70 rows=4 id=options></textarea>'+
                '<div><p onclick="">Product Features CSV</p></div><textarea cols=70 rows=4 id=features></textarea><br><br>&nbsp;'+
                '<div id=postp><p>Initiate Post Processing\t\t' +
                '               *Log*</p></div><textarea cols=70 rows=10 id=postproc></textarea>'+
                '</div>'+
            '<div id=r class=right>'+
                '<div><p onclick="">Category Insert CSV</p></div><textarea cols=70 rows=4 id=catInsert></textarea>'+
                '<div><p onclick="">Category CSV     <textarea cols=4 rows=1 id=startid></textarea>'+
                '<span onClick="script.updateOffset();">change offset</span></p><textarea cols=70 rows=5 id=categories></textarea>'+
                '<div><p onclick="">301 Redirects CSV</p></div><textarea cols=70 rows=6 id=redirects></textarea>'+
                '<div><p onClick="populateAOcsv()">Advanced Options CSV</p></div><textarea cols=70 rows=10 id=advopt></textarea>'+
            '</div>'+
            '</div>'
        );
        $("body").css("min-width","1204px");
        $("#r").css("margin-right","-10px");
        ajaxCallbacks.gencsv = true;
        script = new Script();
        checklist.toplevel = 'done';

        var uploaded = "";
        // here I output results from the last stage
        uploaded += "Extra content recovered from site: \n";
        for(i in Site.uploaded) {
            uploaded += Site.uploaded[i]+"\n";
            $("#result0").prepend(Site.uploaded[i]+"<br>");
        }
        $("#result0").prepend("Extra content recovered from site: <br>");


// load input file
        $('#input').click(function(){
            $.ajax({
                url: "fileops.php",
                global: false,
                type: "POST",
                data: {mode : 'input', id : 'input.txt'},
                dataType: "html",
                async: false,
                success: function(msg) {
                    $('#input')[0].value = msg;
                }
            });
        });

    }
    if(stage==3) {

        script.mapProducts();

    }

}

var t;
var timer_is_on=0;
var abort = false;
function timeLoop(){
    checkStatus();
    t=setTimeout("timeLoop()",500);
}

function doTimeLoop() {
    if (!timer_is_on) {timer_is_on=1;  timeLoop();}
}

function stopTimeLoop() {
    clearTimeout(t); timer_is_on=0;
    abort = true;
    $("#todo").html("<strong>Done!</strong>");
    $("#panic").html("Goodbye!");
    moveOn(2);
}


function pickSite(choice) {

    if(choice==1) {
        site = new Site("http://www.storesonline.com/site/492331");
        site.targets[0] = 'disabled';
        site.targets[1] = 'elderly';
        site.targets[2] = 'handicapped';
        site.targets[3] = 'physically-impaired';
        site.targets[4] = 'seniors';
        site.isMA = true;
        site.tmMatch = /(disabled|elderly|handicapped|physically-impaired|seniors)/ig;
        site.decodeFirstNodes();
    }
    if(choice==2) {
        site = new Site("http://www.arthritissupplies.com");
        site.targets[0] = 'elderly';
        site.targets[1] = 'disability-aids';
        site.targets[2] = 'handicap-products';
        site.targets[3] = 'osteoarthritis';
        site.targets[4] = 'rheumatoid';
        site.targets[5] = 'arthritic';
        site.targets[6] = 'seniors';
        site.targets[7] = 'therapy';
        site.tmMatch =
            /(elderly|disability-aids|handicap-products|osteoarthritis|rheumatoid|arthritic|seniors|therapy)/ig;
        site.decodeFirstNodes();
    }
    if(choice==3) {
        site = new Site("http://www.caregiverproducts.com");
        site.decodeFirstNodes();
    }
    if(choice==4) {
        debug = true;
    }
    //******************   debug override
        debug = true;      // because I think we need the php local
    //******************
    if(document.getElementById('specson').checked===true) {
        specson = true;
    }

    if(document.getElementById('getSelectedTMPs').checked===true) {
        Site.getSelectedTMPs = true;
    } else {
        Site.getSelectedTMPs = false;
    }

}

    // have to initialize these here because if I hard code it I can't override
    document.title = 'The Wright Tool - Javascript SOL Scraper - 2.08';

    // initialize starting variables
    var limit_products = false; var products_limit = 1;
    var catchfail = false;
    var rejectedRelated = [];
    var errorLog = [];
    var lastId = 0;
    var ajaxCallbacks = {};
    var checklist = {};

    $('#todo').html(
        "<strong class='left' onClick='pickSite(1);'>Get mobility-aids.com<br></strong>"+
        "<strong class='right' onClick='pickSite(2);'>Get arthritissupplies.com<br></strong>"+
        "<strong class='left' onClick='pickSite(3);'><p>Get caregiverproducts.com</p></strong>"+
        "<strong class='left' onClick='pickSite(4);'><p>debug</p></strong>"+
        "<input type=checkbox id=specson name=specson value='specsOn' checked=true> "+
            "add specs to product description</form>"+
        "<form><input type=checkbox id=getSelectedTMPs name=getSelectedTMPs value='getSelectedTMPs' > "+
            "get selected, non-product, category target market pages</form>"
        );

    document.getElementById('getSelectedTMPs').checked=false;

    $('#result0').css('height','366px');$('#result1').css('height','366px');
    $('#result2').css('height','366px');

    // start the status monitoring engine
    doTimeLoop();

