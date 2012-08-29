


 2012-02-24 Fri 08:22 PM

            if(C_array[i].match(/I=(.*?)\]/)) {
                pVariant.sku = C_array[i].match(/I=(.*?)\]/)[1];
                if(pVariant.sku.match(/\*/)) {
                    pVariant.sku = product["id"] + pVariant.sku.replace(/\*(.*)/,"$1");
                }
            } else {
                pVariant.sku = "N/A";
                if(catchfail) {alert(C_array[i]+" <- is not a valid sku!");}
            }


 2012-02-11 Sat 01:01 PM


        // then fix the other uploaded content links missed
        if(/""([^" ]*?)(\/site\/371928[^"]*)""/gi.test(text)) {
            text = text.replace(/""([^" ]*?)(\/site\/371928[^"]*)""/gi,
                    "http://www.arthritissupplies.com$2");
            taout.value += "\narthritissupplies malformed "
                        +"links detected corrective measures executed in "
                        +"("+textAreaId+").\n";
        }

        if(/http[^" ]*mobility-aids.com\/members\/492331([^" ]*")/.test(text)){
            text = text.replace(
                /http[^" ]*mobility-aids.com\/members\/492331([^" ]*")/g,
                "/assets$1"
                );
            taout.value += "\nmobility-aids.com/members/492331 "
                        +"resource changed to relative address\n";
        }

        text = text.replace(/members\/492331/g, "assets");


2012-02-10 Fri 05:24 PM


 // so this is where we convert the SOL code for product variations to 3dcart
ProductVariantSet.prototype.createOptionRecord = function(product) {

    var text = "";
    var pVariant = "";


    for(i in this.arrProductVariants) {
            pVariant = this.arrProductVariants[i];
        if (i==0) {
            text += ',';                                // Option ID - This field is filled in by the system. If you are doing an export of current options then leave this field alone. If you are doing a fresh import of new options then leave this field blank. The system will assign this ID.
            text += this.esc(product.id);            // Product ID - This field is required. This is the id of the product that this option will be for. Make sure that the id matches the product.
            text += ',';                                // Catalog ID - If you are doing a fresh import leave this field blank. It will be filled in by the system. If you are doing an export and updating information this field will be filled in by the system
            text += ',';                                // Category ID - If you are doing a fresh import leave this field blank. It will be filled in by the system. If you are doing an export and updating information this field will be filled in by the system
            text += this.esc(this.N);                   // Feature Caption - This is the Name of the option (i.e. Color, Size). This field is required
            text += '"Dropdown",';                      // Feature Type - This is the type of option you want to have. (i.e. Checkbox, Radio Button, Dropdown Menu). The acceptable paramaters are Dropdown, Radio, Checkbox, Title, Text, Textarea, Dropimage, File.
            text += '"0",';                             // Feature Required - This tells the system if this option is required or not. 0 = no 1 = yes
            text += this.sort;                          // already quoted and coma added Sorting - This field defines the order of the options. It only applies when there is more than one option. If no sorting is desired simply fill in 0 for all options.
            text += ',';                                // URL - This field is used to define a url for additional information. If filled out the info icon will show and be a link to this url. This field is not required. If no url is desired then leave field blank.
            text += ',';                                // Info - This field is used to define additional information about the option. If filled out the info icon will show and be a link to a pop up which will display this additional information. This field is not required. If no info is desired then leave field blank.
            text += ',';                                // Feature ID - This field is only used when updating options. It is required and pre-filled by the system. If you are doing a fresh import then leave this field blank
            text += this.esc(pVariant.text);            // Feature Name - This is the name of the option. (i.e. Red, White, Blue or Small, Medium, Large). This field is required.
            text += this.esc(pVariant.price);           // Feature Price - This field defines an additional value for the option. When this option is filled in this value will be added to the base price of the product. If no additional value is desired then leave field blank.                text += ",";                                //
            text += this.esc(i);                        // Sorting - This field defines the order used to display the option values. If no order is desired then enter 0.
            text += this.esc(pVariant.sku);             // Part Number - This field is used to define a specific id to this particular option (ex. If you have a Size option of Small, Medium and Large; each option can have it's own unique id. Small can be sm001, Medium can be med1001, Large can be lrg1001).
            text += ',';                                // Image Path - This field only applies if you are using Dropimage for the Feature Type. This should include the path to the image.
            text += '"1",';                             // Selected - This field defines which option should be pre-selected by default. Enter 1 for the option you want to be pre-selected
            text += '"0"' + "\n";                       // Hidden - This field defines if the option should be hidden. Enter 1 if you want the option to be hidden.

        } else {

            text += ",";                                // Option ID - This field is filled in by the system. If you are doing an export of current options then leave this field alone. If you are doing a fresh import of new options then leave this field blank. The system will assign this ID.
            text += ",";                                // Product ID - This field is required. This is the id of the product that this option will be for. Make sure that the id matches the product.
            text += ",";                                // Catalog ID - If you are doing a fresh import leave this field blank. It will be filled in by the system. If you are doing an export and updating information this field will be filled in by the system
            text += ",";                                // Category ID - If you are doing a fresh import leave this field blank. It will be filled in by the system. If you are doing an export and updating information this field will be filled in by the system
            text += ",";                                // Feature Caption - This is the Name of the option (i.e. Color, Size). This field is required
            text += ",";                                // Feature Type - This is the type of option you want to have. (i.e. Checkbox, Radio Button, Dropdown Menu). The acceptable paramaters are Dropdown, Radio, Checkbox, Title, Text, Textarea, Dropimage, File.
            text += ',';                                // Feature Required - This tells the system if this option is required or not. 0 = no 1 = yes
            text += ",";                                // Sorting - This field defines the order of the options. It only applies when there is more than one option. If no sorting is desired simply fill in 0 for all options.
            text += ",";                                // URL - This field is used to define a url for additional information. If filled out the info icon will show and be a link to this url. This field is not required. If no url is desired then leave field blank.
            text += ",";                                // Info - This field is used to define additional information about the option. If filled out the info icon will show and be a link to a pop up which will display this additional information. This field is not required. If no info is desired then leave field blank.
            text += ",";                                // Feature ID - This field is only used when updating options. It is required and pre-filled by the system. If you are doing a fresh import then leave this field blank
            text += this.esc(pVariant.text);            // Feature Name - This is the name of the option. (i.e. Red, White, Blue or Small, Medium, Large). This field is required.
            text += this.esc(pVariant.price);           // Feature Price - This field defines an additional value for the option. When this option is filled in this value will be added to the base price of the product. If no additional value is desired then leave field blank.                text += ",";                                //
            text += this.esc(i);                        // Sorting - This field defines the order used to display the option values. If no order is desired then enter 0.
            text += this.esc(pVariant.sku);             // Part Number - This field is used to define a specific id to this particular option (ex. If you have a Size option of Small, Medium and Large; each option can have it's own unique id. Small can be sm001, Medium can be med1001, Large can be lrg1001).
            text += ",";                                // Image Path - This field only applies if you are using Dropimage for the Feature Type. This should include the path to the image.
            text += '"0",';                             // Selected - This field defines which option should be pre-selected by default. Enter 1 for the option you want to be pre-selected
            text += '"0"' + "\n";                       // Hidden - This field defines if the option should be hidden. Enter 1 if you want the option to be hidden.
        };
    };
    return text;
};


 2012-02-10 Fri 05:20 PM

Script.prototype.writeOptionsCSV = function(textArea) {
    var text = "optionid,productid,catalogid,category_id,featurecaption,featuretype,"+
    "featurerequired,sorting,url,info,featureid,featurename,featureprice,sorting,partnumber,"+
    "imagepath,selected,hidden\n";

    var product = "";

    for (i in this.products) {
        product = this.products[i];
        if (product["Variation #1"]) { // decode the variations and make product option set
            var pvSet = new ProductVariantSet();
            pvSet.sort = '"0",';
            pvSet.nVariation = "Variation #1";
            pvSet.getProductVariations(product);
            text += pvSet.createOptionRecord(product);
            site.pvSets.push(pvSet);
        }
    if (product["Variation #2"]) { // decode and make another product option set
            var pvSet = new ProductVariantSet();
            pvSet.sort = '"1",';
            pvSet.nVariation = "Variation #2";
            pvSet.getProductVariations(product);
            text += pvSet.createOptionRecord(product);
            site.pvSets.push(pvSet);
    }
   }
   textArea.value = text;
};

 2012-02-09 Thu 05:06 PM

   strMatch = text.strMmatch(re);
            if(strMatch && strMatch[0].match(/"$/)) {                           // this works because && checks in order of appearance
                                                                                // if strMatch is a match and the last character is a " then
                 sub = uha[i].match(/[^\/]*?$/);                                // we have a full match - and we may carry on as usual
                 sub = "/assets/images/"+sub;                                   // create the substitution string
                 text = text.replace(re, sub);                                  // and add the new path to the filename

                 resub = new RegExp(script.encodeRE(sub),"ig");                 // then we use a clumsy method to determine the count

                 taoutvalue += "\n" + sub + " placed this many times (in '" +
                    textAreaId + "' : " + text.match(resub).length;
            }

2012-01-26 Thu 12:29 PM


CategoryCsvRecord.data = {
        "id" : "",
        "category_name" : "",
        "category_description" : "",
        "category_main" : "",
        "category_parent" : "",
        "category_header" : "",
        "category_footer" : "",
        "category_title" : "",
        "category_meta" : "",
        "sorting" : "",
        "numtolist" : "",
        "displaytype"  : "",
        "columnum" : "",
        "iconimage" : "",
        "special_numtolist" : "",
        "special_displaytype" : "",
        "special_columnum" : "",
        "category_columnum" : "",
        "category_displaytype" : "",
        "related_displaytype" : "",
        "related_columnum" : "",
        "listing_displaytype" : "",
        "hide" : "",
        "category_defaultsorting" : "",
        "userid" : "",
        "last_update" : "",
        "itemicon" : "",
        "redirectto" : "",
        "accessgroup" : "",
        "link" : "",
        "link_target" : "",
        "filename" : "",
        "upsellitems_columnum" : "",
        "upsellitems_displaytype" : ""
};

 2012-01-25 Wed 07:14 PM

//The Output Section
//************************************************************
case 'output':
    $fname = $_POST['id'].".csv";
    $text = $_POST['txt'];

    $matches = array();
    if(preg_match_all("/members[^\"]*?\"/i",$text,$matches)
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

 2012-01-24 Tue 08:26 PM

CategoryCsvRecord.prototype.getCategoryHeader = function(page) {
    var i;
    var header = "";
    var outhtml = "";
    var matches = "";
    var s = page.text.match(/<!-- Page Elements (?:start|begin) here -->([\s\S]*<!--) Page Elements end here -->/i);
    if(s && s.length > 1) {
        s = s[1];
    } else {
        if(page.isProductPage) {
            s = page.text.match(/<!-- Main Body (?:starts|begins) here -->([\s\S]*)<!-- Main Body ends here -->/i);
            s = s[1];
        } else {
            alert("page: "+page.name+" is missing critical elements.");
        }
    }

    if(s.match(this.patterns.t107)){                                         // this match identifies ArthritisSupplies.com
        matches = s.match(this.patterns.t107combo);
        for(i = 0; i < matches.length; i++) {
            header += matches[i];              // so then I loop through all the matches of content
        }
    } else {
        matches = s.match(this.patterns.t56all);
        for(i in matches) {
            header += matches[i];
        }
    }

    if(!header) {
        return false;
    }

    outhtml += "<p><hr /><br >page: "+page.name+"<br >";
    if(page.isProductPage) {
        outhtml += header;
        $("#result0").prepend(outhtml);
        $("#result2").prepend(outhtml);
    } else {
        outhtml += "content: <br >"+header;
        outhtml = outhtml.replace(/<script[\s\S]*?<\/script>/ig,"");
        var featured = outhtml.match(/\$154\.95/);
        if(featured) {
            $("#panic").append(prettyPrint(page.name));
        }
        $("#result0").prepend("<hr>"+ outhtml +"<hr>");
        $("#result2").prepend("<hr>"+ outhtml +"<hr>");
    }

    var urls = header.match(/<[^<>]*?492331[^<>]*?>/ig);

    if(urls) {
        $("#todo").append(urls+" does not belong to this domain - correcting...<br>");
        for(i in urls) {
            urls[i] = urls[i].replace(/^.*?com/,"http://www.mobility-aids.com");
            site.wrongDomain[urls[i]] = 'http://www.arthritissupplies.com';
        }
    }
    urls = header.match(/<[^<>]*?270651[^<>]*?>/ig);
    if(urls) {
        $("#todo").append(urls[i]+" does not belong to this domain - correcting...<br>");
        for(i in urls) {
            urls[i] = urls[i].replace(/^.*?com/,"http://www.caregiverproducts.com");
            site.wrongDomain[urls[i]] = 'http://www.caregiverproducts.com';
        }
    }


 2012-01-24 Tue 07:16 PM

       // then fix the other uploaded content links missed
       if(/""([^" ]*?)(\/site\/371928[^"]*)""/gi.test(text)) {
           text = text.replace(/""([^" ]*?)(\/site\/371928[^"]*)""/gi,
                   "http://www.arthritissupplies.com$2");
           taout.value += "\narthritissupplies malformed links detected corrective measures executed ("+textAreaId+").\n";
       }

       if(/http[^" ]*mobility-aids.com\/members\/492331([^" ]*")/.test(text)){
           text = text.replace(
               /http[^" ]*mobility-aids.com\/members\/492331([^" ]*")/g,
               "/assets$1"
               );
           taout.value += "\nmobility-aids.com/members/492331 resource changed to relative address\n";
       }

       text = text.replace(/members\/492331/g, "assets");



  2012-01-24 Tue 03:22 PM

Script.prototype.postProcess2 = function(taout,source,target) {
    var i,key,outmsg;
    // afterwards, try to search for any links not covered by the redirects

    Site.upldHashArray = [];              // yes, first declaration of this
    for(key in Site.upldHash) {
        if(Site.upldHash.hasOwnProperty(key)){
            Site.upldHashArray.push(key);
            //taout.value += key+"\n";
        }
    }

    var re, sub, uha, ss, st, resub;
    var textArea;
    var textAreaId;
    var textAreaIds =
        ['products','features','options',
        'categories','catInsert'];
    while(textAreaIds.length){
        textAreaId = textAreaIds.pop();
        textArea = $('#'+textAreaId)[0];
        text = textArea.value;

        // let's just dump the untouched data before the post processing
        fileout(text.split(), textAreaId+'.prePostCsv');

        // here we search for any found assets that fell through the cracks
        // No, that's not right. I think it's because only the first occurrence
        // of these file urls is getting corrected in housekeeping. So now we're
        // taking out the rest.
        uha = Site.upldHashArray;
        for(i=0;i<uha.length;i++){

            /*
             * if(uha[i].match(/styles\.css/)) {
             *    continue; // that means skip this round and start the next
             *} // ie skip the rest of the code for this iteration and 'continue' on
             * no I should be removing these from the source - housekeeping?
             */

            re = script.encodeRE(uha[i]);
            re = new RegExp(re,"ig");
            sub = uha[i].match(/[^\/]*?$/);
            sub = "/assets/images/"+sub;
            if(re.test(text)) {
                text = text.replace(re, sub);
                resub = new RegExp(script.encodeRE(sub),"ig");
                taout.value += "\n" + sub + " placed this many times (in '" +
                    textAreaId + "' : " + text.match(resub).length;
            } else {
                //taout.value += uha[i] +
                    //"  <--Not Found in: "+textAreaId+"\n";
            }
        }

        // then update all internal links to the new
        window["update of internal links COUNT"] = 0;
        for(i=0;i<source.length;i++) {
            ss = source[i].replace(/^\//,"");
            st = target[i];
            re = new RegExp(script.encodeRE(ss),"ig");
            text = text.replace(re,st);
        }

        //then clean up the <META unwanted tags
        i = text.match(/<META NAME=""source-name""[^>]*?>/g);
        if(i && i.length) {
            taout.value +=
                "*** Filtering <META NAME=\"\"source-name\"\"[^>]*?> "+
                "....found matches: "+ i.length + "\n";
            text = text.replace(/<META NAME=""source-name""[^>]*?>/g,"");
            i = text.match(/<META NAME=""source-name""[^>]*?>/g);
            if(i&&i.length) {
                alert("meta source name filtering failed");
            }
        }

/*
 *        // then fix the other uploaded content links missed
 *        if(/""([^" ]*?)(\/site\/371928[^"]*)""/gi.test(text)) {
 *            text = text.replace(/""([^" ]*?)(\/site\/371928[^"]*)""/gi,
 *                    "http://www.arthritissupplies.com$2");
 *            taout.value += "\narthritissupplies malformed links detected corrective measures executed ("+textAreaId+").\n";
 *        }
 *
 *        if(/http[^" ]*mobility-aids.com\/members\/492331([^" ]*")/.test(text)){
 *            text = text.replace(
 *                /http[^" ]*mobility-aids.com\/members\/492331([^" ]*")/g,
 *                "/assets$1"
 *                );
 *            taout.value += "\nmobility-aids.com/members/492331 resource changed to relative address\n";
 *        }
 *
 *        text = text.replace(/members\/492331/g, "assets");
 *
 */

        textArea.value = text;

        // now I'm converting to MS Windows end line <CR><LF> format
        i = text.match(/\n/g);
        if(i && i.length) {
            i = i.length;
            taout.value += "Converting -> " + textAreaId +
                           " <- to <cr><lf> line terminators\n";
            text = text.replace("/\n/gi","\r\n");
            taout.value += "Changed  -> " + i +
                           " <- newlines to <cr><lf> line terminators\n";
        } else {

            taout.value += textAreaId + " <- gets no <cr><lf> line terminators\n";
        }


        // let's try and post the text to the server to be written to file
        $.ajax({
            url: "fileops.php",
            global: false,
            type: "POST",
            data: {
                mode : 'output',
                txt : text,
                id : textAreaId,
                source : source,
                target : target,
                upldHash : Site.upldHashArray,
                uploaded : Site.uploaded,
                solPics : Site.solPics
            },
            dataType: "html",
            async: false,
            success: function(msg) {
                taout.value += msg;
            }
        });
    }

    // Now I'm sending out all the redirects data I have
    // notice the site[out] referencing a variable with a variable, cool
    var out;
    textAreaIds = ['redirects','source','target'];
    while(textAreaIds.length) {
         out = textAreaIds.pop();
        $.ajax({
            url: "fileops.php",
            global: false,
            type: "POST",
            data: { mode : 'file', text : site[out], name : out },
            dataType: "html",
            async: false,
            success: function(msg) {
                taout.value += msg;
            }
        });
    }

    // and then the list of assets we have preloaded so far
    $.ajax({
        url: "fileops.php",
        global: false,
        type: "POST",
        data: {
            mode : 'fileJSON',
            text : Site.upldHashArray,
            name : 'upldHash'
        },
        dataType: "html",
        async: false,
        success: function(msg) {
            taout.value += msg;
        }
    });
};

2012-01-20, 06:49pm

   while(page.targets.length) {
        // however,
        // if I change the path here, what happens when it's not a
        // getTargetMarketPages chosen one?
        // The newPath should not change when it's not getting tm pages added
        // so this is where we do it the old way, if the old way works

        // this is normal behavior, when it's one of the pages we want to get TMs for
        var greenLight = false;
        if(page.isTmPage || page.boolGetTargetMarketPages) {
            greenLight = true;
        }
        // but need to catch the tm pages that become cascading tm pages
        // I think the 'exempt' property should handle this
        if(greenLight) {
            pageTarget = page.targets.pop();
            newPath = originalNewPath.replace(/.html/,"-" + pageTarget + ".html");
            // debug now and forever
        }
        oldPath = originalPage + '/' + page.targets.pop();
        // so all along it was as simple as checking if it's a tm page and adjusting
        // the newPath, or more importantly NOT changing it, as needed

        $("#result1").prepend(
            "\nGenerating 301 redirect record from oldPath: "+
            oldPath+"<br>with new path: "+newPath
        );

        site.source.push(oldPath);
        site.target.push(newPath);
        site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
        site.redirects.push(oldPath+","+newPath);
    }

    return newPath;
};




2012-01-20, 05:36pm

    var thisTmMatch = oldPath.match(site.tmMatch);

    if(thisTmMatch) {
        if(!page.isTmPage) {
            window[page.url] = newPath;
            return newPath;
        }
    }



2012-01-20, 02:47pm

//gcf
CategoryCsvRecord.prototype.getCategoryFilename = function(page) {             //and build redirect table
    // Here we're going to contiune the practice of cleaning up the path names, but with a report at the end
    //
    var newPath;
    if(page.name.match(/\W/g)) {
        newPath = page.name.replace(/\W/g,"-");                                // takes care of most non-alphanumerics (not -)
        anomalousPageNames[page.name] = newPath;                               // just to make a record of the anomaly
    }
    if(page.name.match(/-{2,}/g)) {
        newPath = newPath.replace(/-{2,}/g,"-");                               // don't need double dashes
        anomalousPageNames2[page.name] = newPath;                               // just to make a record of the anomaly
    }
    if(page.name.match(/-$/)) {
        newPath = newPath.replace(/-$/,"");                                    // don't need trailing - either
        anomalousPageNames3[page.name] = newPath;                               // just to make a record of the anomaly
    }
    if(page.name.match(/^\//)) {
	    alert("and I thought this was no use");
       newPath = newPath.replace(/^\//,"");									   // don't want a leading forward slash either
       anomalousPageNames4[page.name] = newPath;                                // just to make a record of the anomaly
	}

	// so what happens if the page name is not anomalous? oh yeah...
	if(newPath == undefined) {
	   newPath = page.name;
	}
    newPath += ".html";
	// now we should have a valid `newPath` if page.name exists				   //  this.data.filename doesn't work on products TODO!

    if(page.isProductPage) {
        newPath = page.filename = newPath.toLowerCase();                       // page.filename is created here and maybe interchangeable with si
    } else {                                                                   // honestly I need to dispense with CategoryCsvRecord or rename it
        var tmMatch = page.url.match(                                          // site.tmMatch is the regex list of the tm-extensions
            site.tmMatch                                                       // it's defined in functions.js in picksite(choice)
        );
        if(tmMatch && tmMatch[0].length) {
            newPath = newPath.replace(/\.html/,'-'+tmMatch[0]+'.html');
        }
        if(newPath.match(/_\./)) {											   // debugging if this is still necessary
			alert("so this does still happen");
		}
    }
    newPath = newPath.toLowerCase();

    // make a note of the new filename
    site.newPageFilenamesByUrl[page.url] = newPath;
    // let the world know
    var oldPath = page.url.replace(/^.*?com\//,"");                             // convert absolute into relative url sans leading `/`

    $("#result1").prepend(
        "Generating 301 redirect record from oldPath: "+
        oldPath+"<br>with new path: "+newPath+"\n(the primary redirect"
    );

    site.source.push(oldPath);
    site.target.push(newPath);
    site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
    site.redirects.push(oldPath+","+newPath);

    // at this point a normal redirect has been created for this page
    // what does this mean for the tm pages...lets find out
    if(page.isTmPage || page.boolGetTargetMarketPages) {
        Site.tmPageLog[oldPath] = newPath;
        return newPath;
    } else {
        Site.tmPageLogExcluded[oldPath] = newPath;
    }

    var originalPage = oldPath; // for TMP page redirect generation

    if(page.targets == undefined ) {
        alert("no target market definitions");
        return newPath;
    }
    if(page.boolGetTargetMarketPages) {
        getTargetMarketPages(page);
        // this only adds the select tm pages to the stack, it has no bearings on
        // these proceedings
    }
    // so I get the tm pages, don't forget to put then on the exempt list
    // --they're on the exempt list and marked by isTmPage
	// but now what? Generate the

    page.targets = site.targets.slice(); // loads targets into page.targets array
    // targets are prepared, now when to test for isTmPage
    // for if itIs a TmPage then what?

    // lets try to catch these buggers
    // if you have a tm extension then you need only one redirect matching that
    var thisTmMatch = oldPath.match(site.tmMatch);

    if(thisTmMatch) {
        if(!page.isTmPage) {
            window[page.url] = newPath;
            return newPath;
        }
    }

    var originalNewPath = newPath;
    var pageTarget;
    while(page.targets.length) {
        // however,
        // if I change the path here, what happens when it's not a
        // getTargetMarketPages chosen one?
        // The newPath should not change when it's not getting tm pages added
        // so this is where we do it the old way, if the old way works

        // this is normal behavior, when it's one of the pages we want to get TMs for
        var greenLight = false;
        if(page.isTmPage || page.boolGetTargetMarketPages) {
            greenLight = true;
        }
        // but need to catch the tm pages that become cascading tm pages
        // I think the 'exempt' property should handle this
        if(greenLight) {
            pageTarget = page.targets.pop();
            newPath = originalNewPath.replace(/.html/,"-" + pageTarget + ".html");
            // debug now and forever
        }
        oldPath = originalPage + '/' + page.targets.pop();
        // so all along it was as simple as checking if it's a tm page and adjusting
        // the newPath, or more importantly NOT changing it, as needed

        $("#result1").prepend(
            "\nGenerating 301 redirect record from oldPath: "+
            oldPath+"<br>with new path: "+newPath
        );

        site.source.push(oldPath);
        site.target.push(newPath);
        site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
        site.redirects.push(oldPath+","+newPath);
    }

    return newPath;
};



2012-01-20, 01:36pm

if(page.isProductPage) {
        newPath = page.filename = newPath.toLowerCase();                       // page.filename is created here and maybe interchangeable with si
    } else {                                                                   // honestly I need to dispense with CategoryCsvRecord or rename it
        var tmMatch = page.url.match(                                          // site.tmMatch is the regex list of the tm-extensions
            site.tmMatch                                                       // it's defined in functions.js in picksite(choice)
        );
        if(tmMatch && tmMatch[0].length) {
            newPath = newPath.replace(/\.html/,'-'+tmMatch[0]+'.html');
        }
        newPath = newPath.replace(/_\./,page.databaseId + ".");
    }
    newPath = newPath.toLowerCase();

//******************************************************************************

function getTargetMarketPages(page) {


  if(page.noTm=='exempt') {
    return;
  }
  //  if(!page.targets.length) {
  page.targets = site.targets.slice();
  //  }

  var tmUrls = page.url.match(
      site.tmMatch
  );

  if(!tmUrls) {

    var newIndex;
    var tmPage;

    if(!page.isProductPage){
      while(page.targets.length) {
        tmPage = new Page(); // setup the target market page record
        tmPage.name = page.name;
        tmPage.categories = [];
        tmPage.categories.push(page.breadcrumbs);
        tmPage.breadcrumbs = page.breadcrumbs;
        tmPage.isMain = false;
        tmPage.isProductPage = false;
        tmPage.parent = page.databaseId;
        tmPage.databaseId = site.databaseIdOffset++;
        tmPage.url = page.url + '/' + page.targets.pop();
        tmPage.noTm = "exempt";
        tmPage.hidden = true;
        tmPage.isTmPage = true;

        newIndex = site.pages.push(tmPage) - 1;    // add page to the stack being processed
        site.pageIndexByUrl[tmPage.url] = newIndex;        // index is length -1
        site.pageUrlByIndex[newIndex] = tmPage.url;    // and the reverse lookup
        page.noTm = "exempt";
      }
    }
  }
}
//*********************************************************************************

    if(page.getSubPages()) {
        page.hasSubPages = true;
        for(spName in page.subPages) {
            var subpage = new Page();
            subpage.isMain = false;
            subpage.name = spName;
            subpage.breadcrumbs = page.breadcrumbs+'/'+subpage.name;
            subpage.parent = page.databaseId;
            subpage.databaseId = site.databaseIdOffset++;
            subpage.url = page.subPages[spName];

            subpage.mainCat = page.mainCat; // this should have the effect of labelling all the pages so that we
            // can identify which ones are in the groups targeted
            // for debug purposes
            subpageHash[subpage.mainCat] = subpage.name;

        var doops = "rejected duplicate top level link: ";
            if(site.pageIndexByUrl[subpage.url]) {
                $("#result2").prepend(doops+" --> "+subpage.url+"<br>");
            } else {
                $("#result2").prepend("<hr>"+outHtml+"<hr>");
                $("#result0").prepend("<hr>sub page: "+subpage.name+" added to queue for retrieval<hr>");
                // the sitemap pages are messing up the csv generation
                if(!spName.match(/sitemap/ig)) {

                    var newIndex = site.pages.push(subpage) - 1;    // add page to the stack being processed
                    site.pageIndexByUrl[subpage.url] = newIndex;        // index is length -1
                    site.pageUrlByIndex[newIndex] = subpage.url;    // and the reverse lookup
                }
            }
        }
    } else {
        $("#result0").prepend("<hr>Page: "+page.name+" ---> has no sub pages, ending recursion for this branch.<hr>");
    }


    // Here and now we will deal with these TM Pages once and for all
    switch (page.mainCat) {
		case "In the Kitchen":
		case "Getting Ready":
		case "Around the House":
		case "On the Move":
		case "For Your Comfort":

			page.isSelectedForTmPageHarvest = true;

		break;
	}

    // the sitemap pages are messing up the csv generation
    if(!spName.match(/sitemap/ig)) {
        debugdata[spName] =
    }


//gcf
CategoryCsvRecord.prototype.getCategoryFilename = function(page) {             //and build redirect table
    var newPath = page.name.replace(/\W/g,"-");
    newPath = newPath.replace(/-{2,}/g,"-"); // don't need double dashes
    newPath = newPath.replace(/-$/,"");      // don't need trailing - either
    newPath = newPath.replace(/^\//,"");
    newPath += ".html";                                                        // this.data.filename doesn't work on products TODO!
    if(page.isProductPage) {
        newPath = page.filename = newPath.toLowerCase();                       // I have too many filename variables - needs sorting out TODO
    } else {                                                                   // honestly I need to dispense with CategoryCsvRecord or rename it
        var tmMatch = page.url.match(                                          // site.tmMatch is the regex list of the tm-extensions
            site.tmMatch                                                       // it's defined in functions.js in picksite(choice)
        );
        if(tmMatch && tmMatch[0].length) {
            newPath = newPath.replace(/\.html/,'-'+tmMatch[0]+'.html');
        }
        newPath = newPath.replace(/_\./,page.databaseId + ".");
    }
    newPath = newPath.toLowerCase();

    // make a note of the new filename
    site.newPageFilenamesByUrl[page.url] = newPath;
    // let the world know
    var oldPath = page.url.replace(/^.*?com/,"");

    // ************************************************************
    // from here we have the oldPath the newPath base name (no tm extension)
    // so now, if it's a page selected for tmPage harvest then boolGetTargetMarketPages
    // will be set and getTargetMarketPages will initialize the tmp set and push it
    // onto the stack - in this instance then, we need only generate one redirect

    $("#result1").prepend(
        "Generating 301 redirect record from oldPath: "+
        oldPath+"<br>with new path: "+newPath
    );

    site.source.push(oldPath);
    site.target.push(newPath);
    site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
    site.redirects.push(oldPath+","+newPath);

    // at this point a normal redirect has been created for the page coming through
    // what does this mean for the tm pages...lets find out
    if(page.isTmPage || page.boolGetTargetMarketPages) {
        Site.tmPageLog[oldPath] = newPath;
        return newPath;
    } else {
        Site.tmPageLogExcluded[oldPath] = newPath;
    }

    var originalPage = oldPath; // for TMP page redirect generation

    if(page.targets == undefined ) {
        alert("no target market definitions");
        return newPath;
    }
    if(page.boolGetTargetMarketPages) {
        getTargetMarketPages(page);
        // this only adds the select tm pages to the stack, it has no bearings on
        // these proceedings
    }
    // so I get the tm pages, don't forget to put then on the exempt list
    // --they're on the exempt list and marked by isTmPage

    page.targets = site.targets.slice(); // loads targets into page.targets array
    // targets are prepared, now when to test for isTmPage
    // for if itIs a TmPage then what?

    // lets try to catch these buggers
    // if you have a tm extension then you need only one redirect matching that
    var thisTmMatch = oldPath.match(site.tmMatch);

    if(thisTmMatch) {
        if(!page.isTmPage) {
            window[page.url] = newPath;
            return newPath;
        }
    }

    var originalNewPath = newPath;
    var pageTarget;
    while(page.targets.length) {
        // however,
        // if I change the path here, what happens when it's not a
        // getTargetMarketPages chosen one?
        // The newPath should not change when it's not getting tm pages added
        // so this is where we do it the old way, if the old way works

        // this is normal behavior, when it's one of the pages we want to get TMs for
        var greenLight = false;
        if(page.isTmPage || page.boolGetTargetMarketPages) {
            greenLight = true;
        }
        // but need to catch the tm pages that become cascading tm pages
        // I think the 'exempt' property should handle this
        if(greenLight) {
            pageTarget = page.targets.pop();
            newPath = originalNewPath.replace(/.html/,"-" + pageTarget + ".html");
            // debug now and forever
        }
        oldPath = originalPage + '/' + page.targets.pop();
        // so all along it was as simple as checking if it's a tm page and adjusting
        // the newPath, or more importantly NOT changing it, as needed

        $("#result1").prepend(
            "\nGenerating 301 redirect record from oldPath: "+
            oldPath+"<br>with new path: "+newPath
        );

        site.source.push(oldPath);
        site.target.push(newPath);
        site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
        site.redirects.push(oldPath+","+newPath);
    }

    return newPath;
};

