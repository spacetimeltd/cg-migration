function Product() {  }
Product.properties = [];
Product.numberMap = {
    0 : '2', 1 : '3', 2 : '4'
};
Product.map = {
    "Item Number": "id",
    "Name": "name",
    "Summary": "description",
    "Inventory Level": "stock",
    "Weight": "weight",
    "Image URL": "image1",
    "image2": "image2",
    "image3": "image3",
    "image4": "image4",
    "Thumbnail URL": "thumbnail",
    "Keywords": "keywords",
    "Price (Standard Pricing-USD)": "price",
    "Sale Price (Standard Pricing-USD)": "saleprice",
    "Text": "extended_description",
    "Available (Standard Pricing-USD)": "notforsale",
    "On Sale (Standard Pricing-USD)": "onsale",
    "Featured (Standard Pricing-USD)": "homespecial",
    "Tax Free (Standard Pricing-USD)": "nontax",
    "Specification #1": "extra_field_1",
    "Specification #2": "extra_field_2",
    "Specification #3": "extra_field_3",
    "Specification #4": "extra_field_4",
    "Specification #5": "extra_field_5",
    "Specification #6": "extra_field_6",
    "Specification #7": "extra_field_7",
    "Specification #8": "extra_field_8",
    "related": "related",
    "categories": "categories",
    "metatags" : "metatags",
    "filename" : "filename",
    "hide" : "hide",
    "listing_displaytype" : "listing_displaytype"
};

function CategoryCsvRecord() {
    this.data = {
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
    this.patterns = {
        't107' : new RegExp("<!-- page-text.html ends -->|<!-- page-heading.html ends -->","ig"),
        't107combo' :  new RegExp("<!-- page-text.html starts -->[\\s\\S]*?<!-- page-text.html ends -->|<!-- page-heading.html begins -->[\\s\\S]*?<!-- page-heading.html ends -->","ig"),
        't56combo' : new RegExp("<!--\\s*?page-heading[\\s\\S]*?(<[\\s\\S]*?<\\/table>[\\s\\S]*?)(?=<!--)|<!--\\s*?page-text[\\s\\S]*?(<[\\s\\S]*?<\\/div>[\\s\\S]*?)(?=<!--)","ig"),
        't56all' : new RegExp("<!--\\s*?page-heading[\\s\\S]*?(<[\\s\\S]*?<\\/table>[\\s\\S]*?)(?=<!--)|<!--\\s*?page-text[\\s\\S]*?(<[\\s\\S]*?<\\/div>[\\s\\S]*?)(?=<!--)|<!-- page-link.html starts -->[\\s\\S]*?<!-- page-link.html ends -->","ig")
    };
}

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

CategoryCsvRecord.prototype.harvestData = function(page) {                     // the CategoryCsvRecord is used for products
//  var div = document.createElement('div');                                   // so be very carefull - the function names are misleading

    if(page.text.match(/<title>/i)) {                                          // barely usefull, but some title tags go if bad encoding
        if(page.isProductPage) {
            page.databaseId = 'NA';
            page.name = this.getCategoryTitle(page);
        } else  {
           this.data.id = page.databaseId;
        }
        this.data.category_header = this.getCategoryHeader(page);
        this.data.category_name = page.name;
        this.data.category_description = this.getCategoryDescription(page);
        this.data.category_main = this.getCategoryMain(page);
        this.data.category_parent = page.parent;
        this.data.category_footer = this.getCategoryFooter(page);
        this.data.category_title = this.getCategoryTitle(page);
        this.data.category_meta = this.getCategoryMeta(page);                  // watch the order - this one uses category_name
        this.data.filename = this.getCategoryFilename(page) ;

        if(this.data.category_main == 'True' ) {
            this.data.sorting = site.sortingWeight++;
        }
        if(page.hidden) {
            this.data.hide = 1;
        }
    } else {
        alert('Page html is corrupt, sorry, check character encoding.');
    }
};

// debug
var anomalousPageNames = {};
var anomalousPageNames2 = {};
var anomalousPageNames3 = {};
var anomalousPageNames4 = {};


//gcf
CategoryCsvRecord.prototype.getCategoryFilename = function(page) {             //and build redirect table
    // Here we're going to contiune the practice of cleaning up the path names, but with a report at the end
    //
    var newPath = page.name.toLowerCase();
    if(page.name.match(/\W/g)) {
        anomalousPageNames[page.name] = newPath;                                // just to make a record of the anomaly
    }
    newPath = newPath.replace(/\W/g,"-");                                     // takes care of most non-alphanumerics (not -)
    if(page.name.match(/-{2,}/g)) {
        anomalousPageNames2[page.name] = newPath;                               // just to make a record of the anomaly
    }
    newPath = newPath.replace(/-{2,}/g,"-");                                    // don't need double dashes
    if(page.name.match(/-$/)) {
        anomalousPageNames3[page.name] = newPath;                               // just to make a record of the anomaly
    }
    newPath = newPath.replace(/-$/,"");                                         // don't need trailing - either

    if(page.name.match(/^\//)) {
        alert("and I thought this was not necessary");
        anomalousPageNames4[page.name] = newPath;                               // just to make a record of the anomaly
    }
    newPath = newPath.replace(/^\//,"");                                        // don't want a leading forward slash either

    newPath += ".html";
    // now we should have a valid `newPath` if page.name exists                 //  this.data.filename doesn't work on products TODO!

    var tmMatch = page.url.match(                                           // site.tmMatch is the regex list of the tm-extensions
        site.tmMatch                                                        // it's defined in functions.js under picksite(choice)
    );

    if(tmMatch && tmMatch[0].length) {
        // hopefully this will catch pre-existing tm page urls
        if(!page.isTmPage) {
            alert("AHH!");  // this means the tmPage here is unexpected
        }
        newPath = newPath.replace(/\.html/,'-'+tmMatch[0]+'.html');
    }
    if(newPath.match(/_\./)) {                                              // debugging if this is still necessary
        alert("so this does still happen");
    }

    if(page.isProductPage) {
        if(newPath.match(/-discontinued/)) {
            // so now we filter out the discontinued label in the filenames
            page.filename = newPath.replace(/-discontinued/, "");
            newPath = page.filename;
        } else {
            page.filename = newPath;
        }
    }


    // make a note of the new filename
    site.newPageFilenamesByUrl[page.url] = newPath;
    // let the world know
    var oldPath = page.url.replace(/^.*?com\//,"");                             // convert absolute into relative url sans leading `/`

    $("#result1").prepend(
        "Generating 301 redirect record from oldPath: "+
        oldPath+"<br>with new path: "+newPath+" --(the primary redirect)<br>"   // have to use <br> because it's not a textarea
    );

    site.source.push(oldPath);
    site.target.push(newPath);
    site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
    site.redirects.push(oldPath+","+newPath);

    // TODO I'm just not convinced the redirect will be right in the next case
    if(page.isTmPage) {                                                          // in this case we have the only redirect we need
        Site.tmPageLog[oldPath] = newPath;                                       // but this will have to be verified TODO
        return newPath;
    }

    // Here and now we will deal with these TM Pages once and for all
    if(Site.getSelectedTMPs) {
        switch (page.mainCat) {
            case "In the Kitchen":
            case "Getting Ready":
            case "Around the House":
            case "On the Move":
            case "For Your Comfort":

                getTargetMarketPages(page);
                return newPath;

            break;
        }
    }

    // So if we've made it this far, then we have a regular page and it needs
    // a redirect to itself for each of the abandoned target market pages

    page.targets = site.targets.slice();                                        // loads targets into page.targets array

    var originalPage = oldPath;                                                 // for TMP page redirect generation
    var originalNewPath = newPath;                                              // preserves newPath original value
    var pageTarget;                                                             // pageTarget becomes the avatar of each iteration
    while(page.targets.length) {                                                // this is a too clever way to iterate

        pageTarget = page.targets.pop();                                        // so here we hand over the seat to the volunteer
        oldPath = originalPage + '/' + pageTarget;                              // originalPage is oldPath preserved

        $("#result1").prepend(
            "\nGenerating 301 redirect record from oldPath: "+
            oldPath+"<br>with new path: "+newPath+" -- (the TM page redirect)<br>"
        );

        site.source.push(oldPath);
        site.target.push(newPath);
        site.postProcLog += 'source: '+oldPath+"\ttarget: "+newPath+"\n";
        site.redirects.push(oldPath+","+newPath);
    }

    return newPath;
};


CategoryCsvRecord.prototype.getCategoryDescription = function(page) {
    if(page.text.match(/<title>/i)) {
        var result = page.text.match(/<title>(.*?)<\/title>/i);
        if(result.length>1) {
            return result[1];
        } else {
            alert('The page code is missing a title.');
        }
    }
};

CategoryCsvRecord.prototype.getCategoryMain = function(page) {
    if(page.isMain) {
        return 'True';
    }
    else {
        return "False";
    }
};

CategoryCsvRecord.prototype.getCategoryMeta = function(page) {
    var strMetaHtml = "";
    var strOut = "";
    var screener;

    if(page.text.match(/<meta (.*?)>/ig)) {
        strOut += "<hr /";
        strOut += "<h4>META Data scraped from: </h4>"+
            this.data.category_name;
        for(i in page.text.match(/<meta (.*?)>/ig)) {
            screener = page.text.match(/<meta (.*?)>/ig)[i];
            if(!screener.match(/"template-id"/) &&
                !screener.match(/"source-name"/) &&
                !screener.match(/"Content-Type"/i) &&
                !screener.match(/"robot"/)
            ) {

            strMetaHtml += page.text.match(/<meta (.*?)>/ig)[i];
            strOut += "<br />";
            // the next line uses jQuery to escape all htmlentities
            strOut += $("#xtra").text(
                    page.text.match(/<meta (.*?)>/ig)[i]
                ).html();
            } else {
                Site.robotNotes[page.name] =
                    page.text.match(/<meta[^>]*?robot[^>]*?>/);
            }
        }

        if(page.isProductPage) {
          page.productMetaTags = strMetaHtml;                                   // this is where we record the meta info
        }

        $("#result2").prepend(strOut);
        return strMetaHtml;
    } else {
        alert("no meta tags for page: "+page.name);
    }
};

CategoryCsvRecord.prototype.getCategoryTitle = function(page) {
    if(page.text.match(/<title>(.*?)<\/title>/i)) {
        var result = page.text.match(/<title>(.*?)<\/title>/i)[1];
        if(result) {
            return result;
        } else {
            alert('The page: '+page.name+' is missing a title.');
        }
    }
};

CategoryCsvRecord.prototype.getCategoryFooter = function(page) {
    return null;
};

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




    if(urls = header.match(/<[^<>]*?371928[^<>]*?>/ig)) {
        for(var j=0;j<urls.length;j++) {
            if( urls[j].match(/.*\/([^\s]*)/) ) {
                var target = urls[j].match(/.*\/([^\s'"]*)/);
                if(target && target.length > 1) {                                       // means this is a file not a page to process
                    if(target[1].match(/\./)) {
                        // process the file - preload it or something
                        site.remembered[target[1]] = urls[j];
                    } else {
                        if(urls[j].match(/product|page/)) {                               // check if it's in the product pages array
                            var url = urls[j];
                            url = url.replace(/^.*?href=['"](.*?)['"].*?$/,"$1");
                            if(site.pageIndexByUrl[url]>=0) {
                                // this page is already in the queue
                                site.remembered[url] = "was already indexed";
                            } else {
                                // save it for later to make sure it gets got
                                if(!site.remembered[url]) {
                                   site.remembered[url] = page;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var filename;
    var uploaded;
    var backup;

    while(uploaded = header.match(/(["'][^"']*?uploaded\/.*?["'])/ig)) {
        for(i in uploaded)
        {
            filename = uploaded[i].match(/["'].*?uploaded\/(.*?)["']/)[1];
            uploaded[i] = uploaded[i].match(/['"](.*?)["']/)[1];

            backup = header;
            var pattern = new RegExp(uploaded[i],"ig");
            header = header.replace(pattern,"NEW-PATH_PLACEHOLDER"+filename);             // that's were the old site path get updated

            if(!Site.upldHash[uploaded[i]])
            {
                Site.upldHash[uploaded[i]] = true;
                Site.uploaded.push(uploaded[i]);

                // now the fun part - we're preloading the content
                var preloaded = new Image();
                preloaded.src = uploaded[i];                                            // and the content gets loaded into the cache
                $("#result0").append("<br>"+uploaded[i]+"<br>");
                $("#result0").append("has been loaded into the cache for download<br>");
                document.getElementById('result0').appendChild(preloaded);              // to be later downloaded in one batch by 'save as'
            }                                                                           // 'save as -> web page complete' downloads it all
        }
    }

    while(uploaded = header.match(/(["'][^"']*?uploaded\/.*?["'])/ig)) {
        for(i in uploaded)
        {
            filename = uploaded[i].match(/["'].*?uploaded\/(.*?)["']/)[1];
            uploaded[i] = uploaded[i].match(/['"](.*?)["']/)[1];

            backup = header;
            var pattern = new RegExp(uploaded[i],"ig");
            header = header.replace(pattern,"NEW-PATH_PLACEHOLDER"+filename);             // that's were the old site path get updated

            if(!Site.upldHash[uploaded[i]])
            {
                Site.upldHash[uploaded[i]] = true;
                Site.uploaded.push(uploaded[i]);

                // now the fun part - we're preloading the content
                var preloaded = new Image();
                preloaded.src = uploaded[i];                                            // and the content gets loaded into the cache
                $("#result0").append("<br>"+uploaded[i]+"<br>");
                $("#result0").append("has been loaded into the cache for download<br>");
                document.getElementById('result0').appendChild(preloaded);              // to be later downloaded in one batch by 'save as'
            }                                                                           // 'save as -> web page complete' downloads it all
        }
    }

                                                                                           // 492331 Mobility-Aids
    while(header.match(/NEW-PATH_PLACEHOLDER/g)) {
        header = header.replace(/NEW-PATH_PLACEHOLDER/,site.assetsPath3dcart);
    }

    // Oh yeah, I almost forgot to put the google maps back in
    if(header.match(/<!--google-removed-->/ig)) {
        header = header.replace(/<!--google-removed-->/ig,".google.");
    }
    if(header.match(/<!--gstatic-removed-->/ig)) {
        header = header.replace(/<!--gstatic-removed-->/ig,".gstatic.");
    }
    return header;
};


function getExtraPages(page,url,target) {



    $("#result0").prepend(
            "<hr>extra pages found for: "+page.name+", creating page object...<hr>"
    );

                                                                                            outHtml = "<hr>Processing "+url+" <--> "+target+"<br>";
                                                                                            outHtml += "Generating initial required field values for 3dcart product CSV.<br>";
    var pExtra = new Page();
                                                                                            outHtml += "Building sub page data structure.<p>sub page object created</p>";
    pExtra.isMain = false;
                                                                                            outHtml += "<p class=indent>'category_main' set to: 'False'</p>";
    pExtra.name = target;
                                                                                            outHtml += "<p class=indent>'category_name' set to: "+spName+"</p>";
    pExtra.breadcrumbs = page.breadcrumbs+'/'+pExtra.name;
                                                                                            outHtml += "<p class=indent>'categories' set to: "+pExtra.breadcrumbs+"</p>";
    pExtra.parent = page.databaseId;
                                                                                            outHtml += "<p class=indent>'parent' set to database id: "+pExtra.parent+"</p>";
    pExtra.databaseId = site.databaseIdOffset++;
                                                                                            outHtml += "<p class=indent>'id' set to database id: "+pExtra.databaseId+"</p>";
    pExtra.url = url;
                                                                                            outHtml += "<p class=indent>page url for server request: "+pExtra.url+"</p>";
    var doops = "rejected duplicate top level link: ";
    if(site.pageIndexByUrl[pExtra.url]) {
        $("#result2").prepend(doops+" --> "+pExtra.url+"<br>");
    } else {
        $("#result2").prepend("<hr>"+outHtml+"<hr>");
        $("#result0").prepend("<hr>sub page: "+pExtra.name+" added to queue for retrieval<hr>");
        // the sitemap pages are messing up the csv generation
        if(!pExtra.match(/sitemap/ig)) {
            var newIndex = site.pages.push(pExtra) - 1; // add page to the stack being processed
            site.pageIndexByUrl[pExtra.url] = newIndex;     // index is length -1
            site.pageUrlByIndex[newIndex] = pExtra.url;     // and the reverse lookup
        }
    }
}

function ProductVariant() {
    this.text;
    this.price;
    this.sku;
    this.name;
    this.id;
};

function ProductVariantSet() {
    // the product variations raw data looks like
    this.rawData; // N=blahblah;C=blahblah[P=price, I=sku data];C=blahblah[P=price, I=sku data]...etc w/no final ;
   this.N; // is featurecaption - ie the name of the whole set of option choices N=(.*?); replace with nothing
   this.I; // new sku unless * which means append to exsisting sku
   this.P;
   this.sort =  0; // sort value creates the order of listed variations sets on the page - sol only allows 2 sets so it's going to be 0 or 1 (if they're all zero then there's no sorting)
   this.nVariation = "Variation #1";
    this.arrProductVariants = [];
};

// so this is where we put quotes around a thing, making sure to add extra
// to quoted things so they won't get stripped by standard CSV format parsers
ProductVariantSet.prototype.esc = function(text){
    if ( text == 0 ) { return '"0",'; } // this is to prevent 0 = false problems
    if ( ! text) { // null then just coma it up
        return ",";
    }
    return '"' + text.replace(/"/g, '\"\"') + '",'; // doubles exsisting quotes
};

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
            //text += ',';                                // Category ID - If you are doing a fresh import leave this field blank. It will be filled in by the system. If you are doing an export and updating information this field will be filled in by the system
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
            //text += ",";                                // Category ID - If you are doing a fresh import leave this field blank. It will be filled in by the system. If you are doing an export and updating information this field will be filled in by the system
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
ProductVariantSet.prototype.getProductVariations = function(product) {
var rawData = product[this.nVariation];
    var C_array = [];

    if(rawData.match(/N=(.*?);/)) {
        this.N = rawData.match(/N=(.*?);/)[1]; // capturing group should be returned as array[1]
        this.N = this.N.replace(/:/,"");
    } else {
        alert("'"+rawData+"' does not compute...");
    }
    if (rawData.match(/C=(.*?\])/g)){
        C_array = rawData.match(/C=(.*?\])/g); // do matches and groups return a 2d array? no it just returns the matches. no groups
    }
    if(C_array && C_array.length) {
        for(var i=0; i<C_array.length; i++) {

            var pVariant = new ProductVariant(); // forget to do this here and you just keep changing the same object never recording any data
            pVariant.id = product.id;
            pVariant.name = product.name;

            if(C_array[i].match(/C=(.*?)\[/)) {
                pVariant.text = C_array[i].match(/C=(.*?)\[/)[1];
            } else {
                pVariant.text = "N/A";
                if(catchfail) {alert(C_array[i]+" <- is not valid text!");}
            }
            if(C_array[i].match(/P=(.*?),/)) {
                pVariant.price = C_array[i].match(/P=(.*?),/)[1];
            } else {
                pVariant.price = "0";
                if(catchfail) {alert(C_array[i]+" <- is not a valid price!");}
            }
            if(C_array[i].match(/I=(.*?)\]/)) {
                pVariant.sku = C_array[i].match(/I=(.*?)\]/)[1];
                if(pVariant.sku.match(/\*/)) {
                    /*
                     *pVariant.sku = product["id"] + pVariant.sku.replace(/\*(.*)/,"$1");
                     */
                    pVariant.sku = pVariant.sku.replace(/\*(.*)/,"$1");
                }
            } else {
                pVariant.sku = "N/A";
                if(catchfail) {alert(C_array[i]+" <- is not a valid sku!");}
            }

            pVariant.id = product.id;
            pVariant.name = product.name;

            this.arrProductVariants.push(pVariant);
        }
    } else {
        alert("Cannot process product variations for product number: "+product["id"]);
    }
};
function Script() {
    this.products = [];
    this.variations = [];
    this.catHash = {};

};
Script.prototype.updateOffset = function() {
    var textinput = $("#startid")[0];
    var textoutput = $("#categories")[0];
    var text = "";
    var cherry = true;
    var origin = 0;
    var offsetSlip = 0;
        //      page.databaseId = ;

    for (i in CategoryCsvRecord.data) {
        text += i + ",";
    }
    text += "\n";
    for(i in site.pages) {
        // no product pages have id's to offset
        if(!site.pages[i].isProductPage) {
            var catRecord =  site.pages[i].catCsvRecord.data;
            for(field in catRecord) {
                if(field == 'id') {
                    if(cherry) {
                        cherry = false;
                        origin = catRecord[field];
                        offsetSlip = textinput.value - origin;
                    }
                    catRecord[field] += offsetSlip;
                }
                if(field == 'category_parent' &&
                catRecord.category_main == 'False' ) {
                    catRecord[field] = catRecord[field] + offsetSlip;
                }
                if(field == 'sorting' && catRecord.category_main == 'True' ) {
                    catRecord[field] = catRecord[field] + offsetSlip;
                }
                text += this.quote(catRecord[field]) + ",";
            }
            text = text.replace(/,$/,"\n");
        }

    }
    textoutput.value = text;
};

Script.prototype.write301RedirectCSV = function(textArea) {
    var text = "";

    // now we generate the CSV record for 3dcart's 301 redirect import
    var redirectHead = 'id,old_url,new_url'+"\n";
    text += redirectHead;

    for(i=0;i<site.redirects.length;i++) {
        text += '"",'+ site.redirects[i]+"\n";
    }
    for(i=0;i<site.redirects2.length;i++) {
        text += '"",'+ site.redirects2[i]+"\n";
    }
    textArea.value = text;
}

Script.prototype.writeOptionsCSV = function(textArea) {
    var text = "optionid,productid,catalogid,featurecaption,featuretype,"+
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

Script.prototype.writeCategoryCSV = function(textArea) {
    var text = "";

    for (i in CategoryCsvRecord.data) {
        text += i + ",";
    }
    text = text.replace(/,$/,"\n");
    for(i in site.pages) {
        // No Product Pages Allowed in the Category Table
        if(!site.pages[i].isProductPage) {
            var catRecord =  site.pages[i].catCsvRecord.data;
            for(field in catRecord) {
                text += this.quote(catRecord[field]) + ",";
            }
            text = text.replace(/,$/,"\n");
        }
    }
    textArea.value = text;
};

Script.prototype.writeProductsCSV = function(textArea) {                        // this will write only the properties that are mapped
    var text = "";

    for (i in Product.map) {
       text += this.quote(Product.map[i]) + ',';
    }
    text = text.replace(/,$/,"\n");

    for (i in this.products) {
        for (j in Product.map) {
            if(Product.map[j] == 'onsale') {
                if(this.products[i][Product.map[j]] == 'T')
                    this.products[i][Product.map[j]] = 1;
                else
                    this.products[i][Product.map[j]] = 0;
            }
            if(Product.map[j] == 'homespecial') {
                if(this.products[i][Product.map[j]] == 'T')
                    this.products[i][Product.map[j]] = 1;
                else
                    this.products[i][Product.map[j]] = 0;
            }
            if(Product.map[j] == 'notforsale') {
                if(this.products[i][Product.map[j]] == 'T')
                    this.products[i][Product.map[j]] = 0;
                else
                    this.products[i][Product.map[j]] = 1;
            }
            if(Product.map[j] == 'listing_displaytype') {
                this.products[i][Product.map[j]] = 1;
            }

            if(this.products[i][Product.map[j]] == 'T')
                this.products[i][Product.map[j]] = 1;
            if(this.products[i][Product.map[j]] == 'F')
                this.products[i][Product.map[j]] = 0;
            if(this.products[i][Product.map[j]] == 'true')
                this.products[i][Product.map[j]] = 1;
            if(this.products[i][Product.map[j]] == 'false')
                this.products[i][Product.map[j]] = 0;


            text += this.quote(this.products[i][Product.map[j]]) + ',';
        }
        text = text.replace(/,$/,"\n");
    }
    textArea.value = text;
};

Script.prototype.readProductsCSV = function(textArea) {
    var lines = textArea.value.split('\n');
    var titles = lines[0].split('\t');

    for (i in titles) {                                                         // this figures out what the properties are
        Product.properties.push(titles[i]);                                     // (the columns in the excel sheet) and sets up
    }                                                                           // the Product object's properties array
    lines.splice(0,1);                                                          // chop off that line (the titles) from the array
    for (i in lines) {                                                          // the rest of the lines are all products
        if (lines[i]) {
            this.products.push(this.createProduct(lines[i]));                   // set up the products array
        }
    }
};

Script.prototype.createProduct = function(line) {
    var properties = line.split('\t');
    var product = new Product();
    var image1Filename;

    for (i in properties) {
        product[Product.properties[i]] = properties[i];                         // set the appropriate property
        if (Product.map[Product.properties[i]]) {                               // and, if there's a mapping for this property
            if(Product.map[Product.properties[i]] == "image1") {                // this is the worst place to do this
                var imageSrc = properties[i].replace(/^\//,site.root+"/");
                var imageTag = "<img src='"+imageSrc+"'>";
                $("#result0").prepend("<br>image1 found: "+imageTag+" setting thumbnail<br>");
                // (?<=uploaded)(/.*?$) would work but js can't do lookbehinds
                image1Filename = properties[i].replace(/.*?uploaded\/(.*?)/,"$1");
                properties[i] = site.assetsPath3dcart + image1Filename;
            }
            if (Product.map[Product.properties[i]] == "thumbnail") {
                properties[i] = site.assetsPath3dcart + image1Filename;
            }
            if (Product.map[Product.properties[i]] == "thumbnail") {

            }
            if(specson) {                                                       // after all that work, we probably won't use it
                if (Product.map[Product.properties[i]].match(/extra_field/ig)) {// and this is where it's undone
                    properties[i] = "";
                }
            }
            product[Product.map[Product.properties[i]]] = properties[i];        // then set that as well
        }
    }
    product["related"] = this.createRelatedProperty(product);                   // create the related list from product properties
    product["categories"] = this.addCategories(product);                        // apparently order of titles in file matters not
    this.addExtraImages(product);
    this.addSpecsToDescription(product);
    this.addMetaTags(product);
    this.addFilename(product);
    return product;
};

Script.prototype.addFilename = function(product) {
  var page; // product scrape data - really just the page with product content

  var psdIndex = site.psdIndexById[product["Item Number"]];                     // first lookup the page for this product
  if (psdIndex || (psdIndex == 0)) {
       page = site.pages[psdIndex];                                             // then retrieve the filename
       product["filename"] = page.filename;                                     // and put it were it needs to be
  }

}

Script.prototype.addMetaTags = function(product) {
  var page; // product scrape data

  var psdIndex = site.psdIndexById[product["Item Number"]];                     // first lookup the page for this product
  if (psdIndex || (psdIndex == 0)) {
        page = site.pages[psdIndex];                                            // then retrieve the meta data
        product["metatags"] = page.productMetaTags;                             // and put it were it needs to be
  }

};

Script.prototype.addSpecsToDescription = function(product) {
    // if the add specs checkbox is not checked no play will be had here        // if it wasn't meant to be it wasn't meant to be
    var page;

    if(!specson) return;
    var psdIndex = site.psdIndexById[product["Item Number"]]; // lookup product // it sure was fun while it lasted. do it again?
    if (psdIndex || (psdIndex == 0)) {
        page = site.pages[psdIndex];
        window.newSpecHeading = "<h4>" + page.name + " Specifications:</h4>";
        page.productSpecs =
            page.productSpecs.replace(
                /<b>Specifications<\/b>/i, window.newSpecHeading
            );
        product["extended_description"] += page.productSpecs;
    }
};

Script.prototype.addExtraImages = function(product) {
    var extraImages;
    var new3dcartUrl;
    var imageFilename;
    var psd; // product scrape data

    var psdIndex = site.psdIndexById[product["Item Number"]]; // lookup the product
    if (psdIndex || (psdIndex == 0)) {
        psd = site.pages[psdIndex];
        if(psd.extraImages.length) {
            extraImages = psd.extraImages;
            for(i in extraImages) {
                imageFilename = site.imageFilenameByUrlHash[extraImages[i]];
                if(i<4) {

                    new3dcartUrl = site.assetsPath3dcart + imageFilename;
                    product["image"+Product.numberMap[i]] = new3dcartUrl;
                } else {
                    errors_output += "<p>ERROR: more than 4 product images<br>";
                    errors_output += "product number: "+product["Item Number"]+"<br />";
                    errors_output += "product name: "+product["Name"]+"<br />";
                    errors_output += "<h2>image"+i+": "+imageFilename;
                    errors_output += "<img src='"+extraImages[i]+"' /></h2><br /></p>";
                }
            }
        }
    }
};

Script.prototype.addCategories = function(product) {
    var categoriesProperty = "";

    var psdIndex = site.psdIndexById[product["Item Number"]]; // we can look it up

    if (psdIndex || (psdIndex == 0)) {
        var psd = site.pages[psdIndex];
        categoriesProperty += psd.categories[0]; // do the first one without @ in front
        this.catHash[psd.categories[i]] = psd.categories[i];
        if(psd.categories.length > 1){
            for (var i=1; i < psd.categories.length; i++) {
                categoriesProperty += '@'+psd.categories[i]; // do the rest with @ in front so you don't end up with one extra at the end
                this.catHash[psd.categories[i]] = psd.categories[i];
            }
        }
    };
    return categoriesProperty;
};

Script.prototype.createRelatedProperty = function(product) {
    var relatedProperty = "";
    var extracted = "";
    var noComa = true;

    for(i=1;i<=5;i++) {
        if (product["Related Item #"+i]) {
            if(extracted = this.extract(product["Related Item #"+i])) {
                if(noComa) relatedProperty += extracted;
                else relatedProperty += "," + extracted;
                noComa = false;
            }
        }
    }
    return relatedProperty;
};

Script.prototype.extract = function(str) {
    if(str.match(/;P;/)) {
        return str.match(/;P;(.*?)$/)[1];
    } else if(str.match(/;L;/)) {
        rejectedRelated.push(str);
    } else {
        errorLog.push("This is a 'related item' anomaly: "+str);
    }
    return false;
};

Script.prototype.quote = function(text) {
    if ( ! text) {
        return "";
    }
    if (isNaN(text)) {
        return '"' + text.replace(/"/g, '\"\"') + '"';
    } else {
        return '"' + text + '"';
    }
};

Script.prototype.quotePlus = function(text) {
    if ( ! text) { // null then just coma it up
        return ",";
    }
    return '"' + text.replace(/"/g, '\"\"') + '",';
};

Script.prototype.writeFeaturesCSV = function(textArea) {                        // this creates a features csv string
    var text = "id,prodfeature\n";
    var product = "";

    for (i in this.products) {
        product = this.products[i];
        if (product["id"]) {
            if (product["Feature #1"]) { text += product["id"] + ',' + this.quote(product["Feature #1"]) + '\n'; }
            if (product["Feature #2"]) { text += product["id"] + ',' + this.quote(product["Feature #2"]) + '\n'; }
            if (product["Feature #3"]) { text += product["id"] + ',' + this.quote(product["Feature #3"]) + '\n'; }
            if (product["Feature #4"]) { text += product["id"] + ',' + this.quote(product["Feature #4"]) + '\n'; }
            if (product["Feature #5"]) { text += product["id"] + ',' + this.quote(product["Feature #5"]) + '\n'; }
            if (product["Feature #6"]) { text += product["id"] + ',' + this.quote(product["Feature #6"]) + '\n'; }
            if (product["Feature #7"]) { text += product["id"] + ',' + this.quote(product["Feature #7"]) + '\n'; }
        }
    }
    textArea.value = text;
};

Script.prototype.writeCategoryInsert = function(textArea) {
    var output = "category_name\n";
    for(cats in site.breadcrumbsHash) {
        output += this.quote(cats)+"\n";
    }
    textArea.value = output;
};

// how to populate an advanced options csv - advopt.txt
function populateAOcsv() {
    var textarea = $("#advopt")[0];
    var mystring = textarea.value;
    var parsed = mystring.splitCSV();                       // parsed = advanced options file

    var output = "";

    for(k in site.pvSets) {
        var pvSet = site.pvSets[k];                         // get the product variation set
        var pVariants = pvSet.arrProductVariants;           // expose the product variations within the set
        for(j in pVariants) {                               // cycle through said variations
            for(var i = 0; i < parsed.length; i+=8) {       // cycle through the ao.csv data (ea. set of 8 data fields = one record)
              if(pVariants[j].name == parsed[i+1] &&        // then if the product name matches
                  pVariants[j].text == parsed[i+4]) {       // and the option name matches
                    parsed[i+3] = pVariants[j].sku;         // we have a winner, assign the sku
                    parsed[i+5] = pVariants[j].price;       //

                  //************************************
                    output += parsed[i] + ","
                            + parsed[i+1] + ","
                            + parsed[i+2] + ","
                            + parsed[i+3] + ","
                            + parsed[i+4] + ","
                            + parsed[i+5] + ","
                            + parsed[i+6] + ","
                            + parsed[i+7] + "," + "\n";
                  //************************************

                  //   if this doesn't work we can subtract the id from the sku
                  // if(pVariant[j].text == parsed[1+4])
                  // parsed[1+3] = pVariant[j].sku.replace(pVariant[j].id,'')
                  //
                  // So, as it were, make sure the punishment fits the crime
                  // (ie it's the correct option name) then set the AO_suffix
                  // to equal the sku minus the id. Brilliant!

                }
            }
        }
    }


    /*alert(output);*/

//    var count = 0;
//    output = "";
//    for(var i = 0; i < parsed.length; i++) {
//        output += parsed[i]+',';
//        if(count == 8) {
//            count = 0;
//            output += "\n";
//        } else {
//            count++;
//        }
//}

    textarea.value = output;
}

Script.prototype.mapProducts = function() {                                     // when you submit the form


    this.readProductsCSV($('#input')[0]);                                       // we read the input csv text
    this.writeProductsCSV($('#products')[0]);                                   // and use the Product.map to write an output csv
    this.writeFeaturesCSV($('#features')[0]);                                   // use products to create a features csv
    this.writeOptionsCSV($('#options')[0]);
    this.writeCategoryCSV($('#categories')[0]);
    this.writeCategoryInsert($('#catInsert')[0]);
    this.write301RedirectCSV($('#redirects')[0]);

        $('#postp p').click(function() {

            script.postProcessCG($('#postproc')[0],site.source,site.target);

        });

};
//latest
Script.prototype.encodeRE = function(s){
//    return s.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

function hashit(s) {
     for(var x in s) {
        if(s.hasOwnProperty(x)) {
            window.sHash[s[x]] = true;
        }
    }
}

Script.prototype.updateSOLdata = function(taout,source,target) {
      var i,key,outmsg;
    // afterwards, try to search for any links not covered by the redirects

    Site.upldHashArray = [];              // yes, first declaration of this
    for(key in Site.upldHash) {
        if(Site.upldHash.hasOwnProperty(key)){
            Site.upldHashArray.push(key);
            //taout.value += key+"\n";
        }
    }

    // this is how we update the SOL site somewhat
    var redirects = $("#redirects")[0].value;
    var input = $("#input")[0].value;

    var domain = "http://www.caregiverproducts.com/";

    var pattern = /\b[LP];([\w:._/-]+)/;                                          // this gets me the Related Items codes
    var patternPlus = /\b[LP];([\w:._/-]+)./;

    var setA, setB, setTmp, setC;
    setA = input.match(/\b[LP];\/.*?(?=\t)/g);
    setTmp = input.replace(/\b[LP];\/.*?(?=\t)/g, "");
    setB = setTmp.match(/\bP;.*?(?=\t)/g);
    setTmp = setTmp.replace(/\bP;.*?(?=\t)/g, "");
    setC = setTmp.match(/\bL;.*?(?=\t)/g);

    for(var itr = 0; itr < setC.length; itr++) {
        if(setC[itr].match(domain)) {
            setC[itr] = setC[itr].replace(domain,"/");
        }
        Site.tmp = setC[itr].match(/L;([^hH\/].*)/);
        if(Site.tmp&&Site.tmp.length==2) {
            if(redirects.match(Site.tmp[1])) {
                setC[itr] = setC[itr].replace(/L;/,"P;");
            }
        }
    }

    var fullSet = setA.concat(setB,setC);

    while(seeAlso = fullSet.pop()) {
        if(seeAlso.match(pattern)) {
            seeAlso = seeAlso.match(pattern);
        } else {
            alert(seeAlso + " is gumming up the SOL update!");
        }

        var p2, newSal, mode, saVal, saPat, saPnum, saLink;
        if(seeAlso[0].match(/^L/)) {
            // this is a see also link
            saLink = saVal = seeAlso[1];
            // this is a relative url so all it needs
            // is to cross reference through the redirect table
            p2 = saLink.replace(/^\//,"");
            p2 = this.encodeRE(p2);
            saPat = new RegExp(p2); // for later
            p2 = p2 + ",(.*)";
            p2 = new RegExp(p2);
            newSal = redirects.match(p2);
            mode = "L";
        }
        if(seeAlso[0].match(/^P/)) {
            // this is a see also product suggestion
            saPnum = saVal = saPat = seeAlso[1];
            // so for this we need to lookup the url by the product number
            p2 = saPnum + ",(.*)";
            p2 = new RegExp(p2);
            newSal = redirects.match(p2);
            mode = "P";
        }

        var m1, m2, m3, plus;
        // to catch a nomoly.

        m1 = input.match(seeAlso[1]);
        m2 = input.match(saPat);
        m3 = input.match(patternPlus);
        plus = m3[0].replace(m1[0],"");

        if(
                plus != '\t' ||
                m2[0] != m1[1]

        ) {
            // alert(saVal+plus);
        } else {
            if (newSal && newSal.length == 2) {
                newSal = "_UPDATED_;" + domain + newSal[1];
                // then swap it out in the text
                // I'm doing this one at a time so I fix them as I find them
                input = input.replace(pattern,newSal); // should be non global
            } else {
                input = input.replace(pattern,mode + "_SAPLACEMARK_" + seeAlso[1]);
                Site.saRejects[p2] = Site.saRejectCount++;
            }
        }
    }

    input = input.replace(/_SAPLACEMARK_/g,";");
    input = input.replace(/_UPDATED_/g,"L");

    $("#advopt")[0].value = input;
}

Script.prototype.postProcessCG = function(taout,source,target) {
    var i,key,outmsg;
    // afterwards, try to search for any links not covered by the redirects

    Site.upldHashArray = [];              // yes, first declaration of this
    for(key in Site.upldHash) {
        if(Site.upldHash.hasOwnProperty(key)){
            Site.upldHashArray.push(key);
            //taout.value += key+"\n";
        }
    }

    //script.prototype.updateSOLdata(taout,source,target);

    var headline;
    var taoutvalue = false;
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

        uha = Site.upldHashArray;


        for(i=0;i<uha.length;i++){

            re = script.encodeRE(uha[i]);
            re = new RegExp(re,"ig");
            sub = uha[i].match(/[^\/]*?$/);
            sub = "/assets/images/"+sub;
            if(re.test(text)) {
                text = text.replace(re, sub);
                resub = new RegExp(script.encodeRE(sub),"ig");
                // changed taout.value for debug purposes
                taoutvalue += "\n" + sub + " placed this many times (in '" +
                    textAreaId + "' : " + text.match(resub).length;
            }
        }

        if(taoutvalue) {                                                        // so the purpose of this is to initialize `taoutvalue` such that
            re = /false/i;
            headline = textAreaId+" - match counts:\n";
            if(taoutvalue.match(re)) {
                taoutvalue = taoutvalue.replace(re, headline);
            } else {
                taoutvalue = textAreaId+" - match counts:\n"+taoutvalue;        // only if a value is applied will it be displayed to the user
            }
            alert(taoutvalue);                                                  // and recorded to the log
            taout.value += taoutvalue;                                          // then reset to false for the next procedure
            taoutvalue = false;
        }

        // then update all internal links to the new
        window["update of internal links COUNT"] = 0;
        for(i=0;i<source.length;i++) {
            ss = source[i].replace(/^\//,"");
            ss = script.encodeRE(ss);                                           // this gives us the last character after the match
            re = new RegExp(ss+'\\W',"ig");

            // prepare to stop partial match replacements
            // this is where I get really clever
            while(strMatch = text.match(re)) {

                var lastChar = strMatch[0].charAt(strMatch[0].length-1);
                st = target[i]+lastChar;                                        // adding the " to the replace string for subsequent removal

                taoutvalue +=                                                   // if strMatch is a match and the last character is a " then
                    textAreaId+" contains "+strMatch.length
                    +" occurence(s) of the pattern "+strMatch[0]
                    +" and it will be changed from `"
                    +source[i]+"` to `"+st+"`\n";

                text = text.replace(re,st);
            }
        }

        if(taoutvalue) {                                                        // so the purpose of this is to initialize `taoutvalue` such that
            re = /false/i;
            headline = textAreaId+" - update internal links counts:\n";
            if(taoutvalue.match(re)) {
                taoutvalue = taoutvalue.replace(re, headline);
            } else {
                taoutvalue =
                    textAreaId+" - update internal links counts:\n"+taoutvalue; // only if a value is applied will it be displayed to the user
            }
            alert(taoutvalue);                                                  // and recorded to the log
            taout.value += taoutvalue;                                          // then reset to false for the next procedure
            taoutvalue = false;
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

            taout.value +=
                textAreaId + " <- gets no <cr><lf> line terminators\n";
        }

        if(/members\/[^"]*?"/ig.test(text)) {
            // this was causing all kinds of errors in the php
            re = /members\/[^"]*?"/ig;
            taoutvalue = text.match(re);
            alert(text.match(re).toString());
            taout.value += "\nthis is all the unfixed/unupdated urls left\n";   // if this happens it's most likely because I disabled `housekeeping` (lol, housekeeping is disabled)
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
//                writeConsole(msg);
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



