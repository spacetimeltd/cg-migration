function Site(href) {
    /*if(debug) {
        this.spaceQapi = './twapi2.php';
    } else {
        this.spaceQapi = 'http://www.spacetimeltd.us/the-wright-move/theWrightApi2.php';
    }*/
    this.spaceQapi = './twapi2.php';
    this.root = href;
    this.isMA = false;
    this.pages = [];
    this.scrapeLog = [];

    this.pageIndexByUrl = {};
    this.pageUrlByIndex = {};

    this.tmPages = [];
    this.tmPageIndexByUrl = {};
    this.tmPageUrlByIndex = {};
    this.targets = [];
    this.tmMatch;
    this.notDoneHere = true;

    this.databaseIdOffset = 547;
    this.productsDone = {};
    this.imageFilenameByUrlHash = {};
    this.psdIndexById = {};
    this.pcount = 1;
    this.sortingWeight = 1;
    this.breadcrumbsHash = {};

    this.newPageFilenamesByUrl = {};
    this.slipCrack = {};
    this.wrongDomain = {};
    this.oldSOLelem = {};
    this.redirects = [];
    this.redirects2 = [];
    this.remembered = {};
    this.assets = [];

    this.assetsPath3dcart = "/assets/images/";

    this.pvSets = [];

    this.source = [];
    this.target = [];
    this.postProcLog;
}

Site.uploaded = [];
Site.upldHash = {};
Site.solPics = [];
Site.robotNotes = {};
Site.allLinks = [];
Site.ah1={}, Site.ah2={}, Site.bh1={}, Site.ch1={};
Site.aa1=[], Site.ba1=[];
Site.aUrls=[], Site.cUrls=[], Site.bUrls=[];
Site.abcLog={}, Site.cUrlsInContext=[];
Site.cHashFull={};
Site.cHashFullCount=0;
Site.gradedLinks={};
Site.urlsToRedirect={};
Site.allUrls={};
Site.urlRejects={};
Site.urlsProcessed={};
Site.assetsRedirects={};
Site.falseRedirects={};
Site.urlsProcessedCount=0;

Site.saRejectCount=0;
Site.saRejects = {};

Site.tmPageLog = {};
Site.tmPageLogExcluded = {};

Site.firstScripts = {};

// so this is the way it works
function Page() {
    this.hidden = false;
    this.isTmPage = false;
    this.noTm = "";
    this.boolGetTargetMarketPages = false;
    this.mainCat;
    this.targets=[];
    this.text = "";
    this.databaseId="";
    this.name;
    this.url;
    this.isMain;
    this.parent;
    this.breadcrumbs = "";
    this.hasProductPages = false;
    this.productPages = {};
    this.isProductPage = false;
    this.hasSubPages = false;
    this.subPages = {};
    this.productPages = {};
    this.extraImages = [];
    this.productSpecs = "";
    this.productMetaTags = "";
    this.categories;
    this.catCsvRecord = new CategoryCsvRecord();
};

Page.prototype.getProductPages = function() {
    var aTags;
    var pID; var ppUrl;
    var pageText = "";

    if(this.text.match(/<!-- page-productlist.html starts -->[\s\S]*?<!--/ig)){
        pageText = this.text.match(/<!-- page-productlist.html starts -->[\s\S]*?<!--/ig)[0];
        var div = document.createElement('div');    // then I turn the chunk of code text back into
        div.innerHTML = pageText;           // a page element so that i can use getElementsByTagName

        // there are two links for each product in the list, one for the image and one for the show,
        //      two to get ready, and well...you know
        aTags = cleanUpTagsList(div.getElementsByTagName('a'));

        for (var i=0; i < aTags.length; i++) { // all the aTags we have here are for products
            if(aTags[i].indexOf("http://")==0) ppUrl = aTags[i];
            else ppUrl = site.root + aTags[i];// ppUrl is the href, but it's still a relative address
            // get the pID - it's in the href so this works
            pID = aTags[i].replace(/(.*?)(\/product\/)([A-Za-z0-9]*)/g, "$3");
            $("#result0").prepend("<hr>Found page for product: "+pID+" at: "+ppUrl+" processing...<hr>");
            this.productPages[pID] = ppUrl; // now we have the list of products on this page
        }
        return true;
    } else {
        return false;
    }
};


Page.prototype.getSubPages = function() {
    var pageSect;
    if(this.isTmPage) {
        $("#result1").prepend(this.name + " <--- stop this getting of subpages for TMs\n")
    }
    // if it has subpages then we make a hash of the subpage urls keyed by subpage name
    if(this.text.match(/<!-- Sub Pages[\s\S]*?<!--/ig)){
        pageSect = this.text.match(/<!-- Sub Pages[\s\S]*?<!--/ig)[0];
    // this pulls out the section of page code that ^^^^^^^^^ SOL was nice enough to label for us.
        var div = document.createElement('div');    // then I turn the chunk of code text back into
        div.innerHTML = pageSect;           // a page element so that i can use getElementsByTagName
        var elements = div.childNodes;          // to get the hrefs I'm after
        var aTags = div.getElementsByTagName('a');

        for (var i=0; i < aTags.length; i++) {
            var spName = aTags[i].text;             // s(ub)p(age)Name - innerHTML gives ...>this</a>
            spName = spName.replace(/\s{2,}/g,'<!--whitespace-->');
            spName = spName.replace(/<!--whitespace-->/g,' ');
            var spUrl = aTags[i].getAttribute('href');// spUrl is the relative address

            if(spUrl.indexOf("http")!==0) {
                this.subPages[spName] = site.root + spUrl;
            }else {
                this.subPages[spName] = spUrl;
            }

        }
        return true;
    } else {
        return false;
    }
};

Site.prototype.initSiteCrawl = function(url) {
    if(abort) return;

    var domainCheck;                                                    // make sure we don't pull down
    if(site.root.match(/storesonline/i)) {                              // any pages from outside the domain
        domainCheck = /storesonline/i.test(url);
    }
    if(site.root.match(/arthritissupplies/i)) {
        domainCheck = /arthritissupplies/i.test(url);
    }
    if(site.root.match(/caregiverproducts/i)) {
        domainCheck = /caregiverproducts/i.test(url);
    }
    if(!domainCheck) {
        if(url){
            alert("Not sure this is the right url:\n"+
            "\t"+url+"\n"+"I've skipped it. Moving on...");
        }
        ajaxCallbacks.toplevel = true;
        return;
    }
    var scrape = document.createElement('script');
    var pIndex;
    var request = this.spaceQapi;

    // now I'm trying to fix the %20 that comes up in the CG email link
    if(url.match(/%20/)){
        alert("Not sure this is the right url:\n"+
        "\t"+url+"\n"+"I've skipped it. Moving on...");

        pIndex = this.pageIndexByUrl[url];
        site.initSiteCrawl(this.pageUrlByIndex[pIndex+1]);
        return;
    }

    // now this is the main event here... sort of
    // ***********************************************++++++++++++++++++++++++++++++++++++++++++++++++++++
    pIndex = this.pageIndexByUrl[url];

    if(pIndex>=0 && pIndex<this.pages.length) {                         // that index 0 always trips me up
        request += "?url=" + this.pages[pIndex].url;
    } else {
        ajaxCallbacks.toplevel = true;
        return true;
    }
    // ***************************************************************************************************


   request += "&callback=siteCrawlCallback";
   request += "&monolithic_cache";

   scrape.setAttribute('type', 'text/javascript');
   scrape.setAttribute('src', request);
   scrape.setAttribute('id', url);

   // Insert <script> into DOM
   document.getElementsByTagName('head')[0].appendChild(scrape);
   // that was the ajax call - now we wait for the callback
   $("#todo").html("Communicating with server, please wait...");
   $("#result1").prepend("<hr><pre>Contacting server, please wait...</pre><hr>");

   ajaxCallbacks.waiting_for_url = url;

};



Site.prototype.decodeFirstNodes = function() {
alert("Accessing:\n\n\t "+this.root+" \n\n\t\t\tplease wait...");
    var scrape = document.createElement('script');

    var url = this.spaceQapi;
    url += "?url=" + this.root;
    url += "&callback=decodeFirstNodesCallback";
    url += "&monolithic_cache";
    scrape.setAttribute('type', 'text/javascript');
   scrape.setAttribute('src', url);
   scrape.setAttribute('id', 'root');

   // Insert <script> into DOM
   document.getElementsByTagName('head')[0].appendChild(scrape);
};




function cleanUpTagsList(tags){
    var hash = {};
    var array = [];
    var temp = "";

    for (var i=0; i < tags.length; i++) {
        temp = tags[i].getAttribute('href');
        if(!hash[temp]) { // if it doesn't exist in the hash
            array.push(temp); // then it's unique a we will save it
            hash[temp] = temp; // then make it exsist in the hash
        }
        // for debug we limit product links scraped
//      if (limit_products && (i>=products_limit)) return array;
    };
    return array;
};

function getProductSpecs(page)  {
    if(page.isProductPage) {

        var txt = page.text;                                                                      // here we are checking for the peculiarities
        var productSpecsPattern = /<!-- product-specs.html starts -->[\s\S]*?<\/table>/ig;        // that distinguish the different versions of the SOL platform
        if(txt.match(productSpecsPattern)) {                                                      // this test identifies mobility-aids.com
            txt = txt.match(productSpecsPattern)[0];                                              // and caregiverproducts.com
        } else {
            productSpecsPattern =
                /<!--.?product-specs.html.?begins[\s\S]*?product-specs.html.?ends.?-->/ig;        // this test identifies arthritissupplies.com
            if(txt.match(productSpecsPattern)) {
                txt = txt.match(productSpecsPattern)[0];
            } else {
                txt = "";
            }
        }
        if(!txt) return false;                                                                    // if there's no text there's no reason to be here

        // now we neutralize any unwanted scripts
        txt = txt.replace(/<script[\s\S]*?\/script>/ig,"");

        $("#result2").prepend("<h3>Product Specifications(Raw HTML)</h3> "+$("#xtra").text(txt).html() + "<br>");

        page.productSpecs = txt;

        $("#result0").prepend("Product Specs: <br>"+ page.productSpecs+"<br>");
    }
};

function getNonProductContent(page) {
//  if(page.isProductPage) {return;}

    page.catCsvRecord.harvestData(page);

};

function getProductPages(page) {

    if(page.getProductPages()) {
        page.hasProductPages = true; // and we now have a filled productPages array, thanks getProductPages

        $("#result0").prepend("<hr>Product listings found on category page: "+page.name+", processing...<hr>");

        var ppUrl;
        var outHtml = "";

        for(ppName in page.productPages) {
            if(limit_products && (products_limit--)) { return; }
            ppUrl = page.productPages[ppName];
            outHtml = "<hr>Processing "+ppUrl+" <----> "+ppName+"<br>";
            outHtml += "Generating required product values for 3dcart database.<br>";
            //here's the thing, product listing could be a duplicate from a different category, so
            if(site.pageIndexByUrl[ppUrl]>=0) {                             // if this product has come up before,
            pIndex = site.pageIndexByUrl[ppUrl];                            // we will look it up
            productPage = site.pages[pIndex];                               // access the existing record
            productPage.categories.push(page.breadcrumbs);                  // and update the category list
            outHtml += "<p class=indent>Product record exsists already with the following category list:<br>";
            outHtml += "<ul>"+productPage.categories+"</ul>";
            outHtml += "adding new category code: "+page.breadcrumbs+"</p>";
            $("#result0").prepend("<hr>Page "+ppName+" already found, updating category record ---> "+ppUrl+"<hr>");
            } else {                                                        // otherwise we start afresh
            var productPage = new Page();
                                                outHtml += "Building product page data structure.<br>";
                productPage.categories = [];                       // now we can record the breadcrumb trail
                                                outHtml += "<p class=indent>product page object created</p>";
                productPage.categories.push(page.breadcrumbs);
                productPage.breadcrumbs = page.breadcrumbs;                 // I want breadcrumbs for nothing - this is not useful
                                                outHtml += "<p class=indent>'categories' value set to: ";
                productPage.isMain = false;                 outHtml += productPage.categories+"<br>";
                                                outHtml += "<p class=indent>'category_main' set to: 'False'</p>";
                productPage.isProductPage = true;
                                                outHtml += "<p class=indent>isProductPage set to true</p>";
                productPage.parent = "not applicable";                      // product pages don't have parents just cats
                                                outHtml += "<p class=indent>'category_parent' is not applicable</p>";
                productPage.databaseId = "";                                // it's a product not a category so no dbid
                productPage.name = ppName;
                                                outHtml += "<p class=indent>product sku: "+ppName+"</p>";
                productPage.url = ppUrl;
                                                outHtml += "<p class=indent>product page url: "+ppUrl+"</p>";
                productPage.pcount = site.pcount++;

                $("#result1").prepend("<hr>Page "+ppName+" added to retrieval stack ---> "+ppUrl+"<hr>");

                var newIndex = site.pages.push(productPage) - 1;            // add page to the stack being processed
                site.pageIndexByUrl[ppUrl] = newIndex;                      // index is length -1
                site.psdIndexById[ppName] = newIndex;                       // for the csv
                site.pageUrlByIndex[newIndex] = ppUrl;                      // and the reverse lookup
            }
            $("#result2").prepend(outHtml+"<hr>");
        }
    } else {
        if(page.isProductPage) {
            $("#result0").prepend("<hr>"+page.name+" ---> is a product page, 'specifications' content will be extracted...<hr>");
        } else {
            $("#result0").prepend("<hr>"+page.name+" ---> is an info page, all content will be extracted...<br>");
        }
    }
};

// debug
var subpageHash = {};
// debug

function getSubPages(page) {
    var outHtml = "";
    if(page.isTmPage) {
        $("#result1").prepend("aborted attempt to get subpages for url" +
            page.url);
        return;
    }
    if(page.getSubPages()) {
        page.hasSubPages = true;
        $("#result0").prepend("<hr>sub pages found for: "+page.name+", creating page object...<hr>");
        for(spName in page.subPages) {
            outHtml = "<hr>Processing "+spName+" <--> "+page.subPages[spName]+"<br>";
            outHtml += "Generating initial required field values for 3dcart product CSV.<br>";
            var subpage = new Page();
            outHtml += "Building sub page data structure.<p class=indent>sub page object created</p>";
            subpage.isMain = false;
            outHtml += "<p class=indent>'category_main' set to: 'False'</p>";
            subpage.name = spName;
            outHtml += "<p class=indent>'category_name' set to: "+spName+"</p>";
            subpage.breadcrumbs = page.breadcrumbs+'/'+subpage.name;
            outHtml += "<p class=indent>'categories' set to: "+subpage.breadcrumbs+"</p>";
            subpage.parent = page.databaseId;
            outHtml += "<p class=indent>'parent' set to database id: "+subpage.parent+"</p>";
            subpage.databaseId = site.databaseIdOffset++;
            outHtml += "<p class=indent>'id' set to database id: "+subpage.databaseId+"</p>";
            subpage.url = page.subPages[spName];

            // this is where I get post crazy
            subpage.mainCat = page.mainCat; // this should have the effect of labelling all the pages so that we
            // can identify which ones are in the groups targeted
            // for debug purposes
            subpageHash[subpage.mainCat] = subpage.name;
            // ..................

            outHtml += "<p class=indent>page url for server request: "+subpage.url+"</p>";
            // now here it get crazy, I think if I push this onto the end of the array we are currently
            // processing, it will change the length so the search will continue until all pages have been found
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
}

function decodeFirstNodesCallback(data) {           // this is the callback
    var hText = "";
    var resultArray = [];
    var pIndex = data.pop(); // it's the first one, index 0, so I don't need this pop
    if(pIndex == 'failed') {alert("server could not access "+site.root);}

    var i = 0;
    for (; i < data.length; i++) {
        hText += data[i];
    }

    var div = document.createElement('div');     // then I turn the chunk of code text back into
    div.innerHTML = hText;
    var scripts = div.getElementsByTagName('script');

    for (i=0; i < scripts.length; i++) {
        // get the main nav links - could slice out the nav links segment of code but
        // may change my mind about the nav links slicing


        if(scripts[i].textContent.match(/outName/ig) ||
            scripts[i].textContent.match(/outName = .*?"(.*?)";/)){ // making sure the scripts' got the urls is enough

            $("#result0").append("<h3>Extracting javasctript source code for encoded links:</h3>");

            if(scripts[i].textContent.match(/(outName,\s*?"(\S*?)")/)) {
                resultArray = scripts[i].textContent.match(
                    /(outName.?=.*?"(.*?)")|(outSequence.?=.*?\+\s?'(\d+)';)|(outName,\s*?"(\S*?)")/ig
                );
            } else {
                resultArray = scripts[i].textContent.match(
                    /(outName\s?=\s?["'](.*?)["'])|(outSequence\s?=.*?\+\s?'(\d+)';)|(outURL\s?=\s?'(.*?)')/ig
                );
            }

            $("#result0").append(resultArray+"<h3>Processing...</h3>");
            for (var ii=0; ii < resultArray.length; ii+=3) {

                page = new Page(); // I prefer to create the new object just in time to use
                page.isMain = true;
                page.parent = 0;
                page.databaseId = site.databaseIdOffset++;
                page.name = unescape(resultArray[ii].replace(/(outName\s?=\s?["'](.*?)["'])/, "$2"));
                // at least one page name has unwanted html tags in it
                page.name = page.name.replace(/((\<.*?\>))/g,"");
                if(!resultArray[ii+3]) {  // there's not enough data left, something's missing
                    ajaxCallbacks.root = true;
                    // we have what we needed, now we clean up the head
                    var done = document.getElementById('root');
                    if(done){   // if it exsists already we have to destroy it
                         document.getElementsByTagName('head')[0].removeChild(done);
                    }
                    $("#result1").append(prettyPrint(resultArray));

                    // return;
                }
                page.sortval = resultArray[ii+1].replace(/(outSequence\s?=.*?\+\s?'(\d+)';)/, "$2");
                if(resultArray[ii+2].match(/(outName,\s*?"(\S*?)")/)) {
                    page.url = resultArray[ii+2].match(/(outName,\s*?"(\S*?)")/)[2];
                    // if(page.url.indexOf("http://")!=0) page.url = site.root + page.url;
                } else {
                    page.url = resultArray[ii+2].replace(/(outURL\s?=\s?'(.*?)')/, "$2");
                } // relative url

                if(page.url.indexOf("http://")!=0) {
                    page.url = site.root + page.url;
                }
                if(page.name == "Home") {
                    page.breadcrumbs = page.name;
                }
                page.breadcrumbs = page.name;
                // i made this
                page.mainCat = page.name;
                // sit
                $("#result2").append("<hr>Page name: "+page.name+"<br>Sort Value: "+page.sortval+
                    "<br>Page Url: "+page.url+"<hr>");

                var doops = "rejected redundant top level link: "; // should be no duplicates but just in case
                if(site.pageIndexByUrl[page.url]) {
                    alert(doops+" --> "+page.url);
                } else {
                    // the Caregivers hack
                    if (page.name == "Caregiver Products Catalog Request Form") {
                        break;
                    }
                    var newIndex = site.pages.push(page) - 1;   // add to queue of pages to be ajaxed
                    site.pageIndexByUrl[page.url] = newIndex;   // and record the index of the new entry
                    site.pageUrlByIndex[newIndex] = page.url;   // and the reverse lookup
                }
            };
            $("#result1").append(prettyPrint(resultArray));
        } else {
            // usefull for debug to see what the rejects are
            Site.firstScripts[(scripts[i].outerHTML)] = scripts[i].innerHTML;
        }
    }
    ajaxCallbacks.root = true;
    // we have what we needed, now we clean up the head
    var done = document.getElementById('root');
   if(done){    // if it exsists already we have to destroy it
       document.getElementsByTagName('head')[0].removeChild(done);
   }
}

function getExtraProductImages(pPage) {
    if(!pPage.isProductPage) return;

    var ppHref = pPage.url;                  //ppHref Product Page Href
    var ppID = pPage.name;
    var ppCategories = pPage.categories;
    var mArray = [];
    var ppText = pPage.text; // this might work???
    var pageSect = "";

    if(ppText.match(/<!-- Start product-images.html -->([\s\S]*?)<!--/g)){
        pageSect = ppText.match(/<!-- Start product-images.html -->([\s\S]*?)<!--/g)[0];
    // this pulls out the section of page code that ^^^^^^^^^ SOL was nice enough to label for us.
        var div = document.createElement('div');    // then I turn the chunk of code text back into
        div.innerHTML = pageSect;                           // a page element so that i can use getElementsByTagName
        var elements = div.childNodes;                  // to get the hrefs I'm after
        var scriptTags = div.getElementsByTagName('script');
        var imageUrl = "";
        var outputHtml = "";
        var filename = "";

        if(scriptTags.length) {

            outputHtml =    "<p>product sku: "+ppID+
                                "<br>product category: "+ppCategories+
                                "<br>product url: "+ppHref;
            var doOnce = 1;
            for (var i=0; i < scriptTags.length; i++) {


                mArray = scriptTags[i].text.match(/'(.*?\/(members\/[0-9]*?\/uploaded\/(.*?)))'/);
                if(mArray) {
                    if(!mArray[2].match(/371928/)) {        // mArray[2] = /members/[0-9]*?/uploaded/filename
                        site.scrapeLog.push("anomaly: "+mArray[2]+"\n");
                    }
                    imageUrl = mArray[2];
                    site.imageFilenameByUrlHash[imageUrl] = mArray[3];  //give ulr-get mArray[3]=filename
                    outputHtml += "<br>product image: "+imageUrl;

                    $("#result0").prepend("<img src='"+site.root+'/'+imageUrl+"' />");
                    pPage.extraImages.push(imageUrl);
                } else {
                    site.scrapeLog.push("<br>image tag has no image src:"+ppID+"\n");
                }


            }

            $("#result0").prepend(outputHtml + "</p>");

        } else {
            outputHtml =    "<p>product sku: "+ppID+
                                "<br>product category: "+ppCategories+
                                "<br>product relative url: "+ppHref+
                                "<br>product image: No Extra Images Detected</p>";
            $("#result0").prepend(outputHtml);

        }
       $("#result0").prepend(ppHref+" Aquired Successfully!");
        $("#result0").prepend("<hr />Extra data from product page ---> ");
    }
};

function buildLayout() {
    var htmlOut = "";

};

String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
};

function siteCrawlCallback(data) {
    if(abort) return;
    if(!data && data!=0) {
        alert("server returned nothing. uh oh.");
    }
    var hText = "";
    var resultArray = [];
    var url = data.pop();
    var pIndex;

    if(!(site.pageIndexByUrl[url]>=0)) {
        url += data.pop();
        alert("server could not process request for: "+url);
        return false;
    }

    pIndex = site.pageIndexByUrl[url];

    var page = site.pages[pIndex];
   $("#result1").prepend("<hr><h4>attempting page retrieval <em>"+pIndex+
    "</em>: "+page.name+" ---> data received successfully, processing...</h4><hr>"
   );

   // here we convert the array of lines into a continuous string glued with \n
   for (var i=0; i < data.length; i++) {
        page.text += data[i];
        // originally I chose to forgo the newline here, beware of side effects
   }


//###################################
if(!page.isTMpage){

        // now we get the next level
        getSubPages(page);

        // then look for product pages
        getProductPages(page);

        // if it's a product page
        getExtraProductImages(page);
        // and why not
        getProductSpecs(page);

        // if not get all other content
        getNonProductContent(page);

        // hash the breadcrumbs for catinsert
        site.breadcrumbsHash[page.breadcrumbs] = 'done';

        // now we do some housekeeping
        houseKeeping(page);

} else {
        // houseKeeping(page);
        getNonProductContent(page);
}
//###################################

    // clean up the head

    var done = document.getElementById(url);
    if(done){ // if it exsists already we have to destroy it
        document.getElementsByTagName('head')[0].removeChild(done);
    } else {
        alert("can't find element id: "+pIndex);
        return;
    }


    url = site.pageUrlByIndex[pIndex+1];

    // this is where we insert the TM pages if required
    if(!url && Site.getSelectedTMPs) {
        // this is where it happens
        site.pageUrlByIndex = site.pageUrlByIndex.concat(site.tmPageUrlByIndex);
        site.pageIndexByUrl = site.pageIndexByUrl.concat(site.tmPageIndexByUrl);
        url = site.pageUrlByIndex[pIndex+1];
    }

    site.initSiteCrawl(url);

}

function getHiddenProducts(aProdsTSV) {
    var i=0;
    var nAvailField; // the column number of the 'Available' field
    var header = aProdsTSV[i].split('\t'); // isolated the tab delimited vals
    // so header is now the column names, need to find the 'Available' field
    for(var ii = 0; ii < header.length; ii++) {
        if(header[ii].match(/Available/i)) {
            nAvailField = ii;
        }
    }
    // now we scan for records where 'Available' = F
    for(i=1;i<aProdsTSV.length;i++) {
        if(aProdsTSV[nAvailField].match(/F/i)) {
            // add this product to page list
            addProductPage();
        }
    }
}

function addProductPage() {
    var productPage = new Page();

    productPage.categories = [];
    productPage.categories.push( "Web Specials/Discontinued Items" );
    productPage.breadcrumbs = "Web Specials/Discontinued Items";
    productPage.isMain = false;
    productPage.isProductPage = true;
    productPage.parent = "not applicable";
    productPage.databaseId = "";

    productPage.name = ppName;                                                  // need something here, not ppName
    productPage.url = ppUrl;                                                    // need somehting no ppUrl, too
    productPage.pcount = site.pcount++;

    var newIndex = site.pages.push(productPage) - 1;                            // add page to the stack being processed
    site.pageIndexByUrl[ppUrl] = newIndex;                                      // index is length -1
    site.psdIndexById[ppName] = newIndex;                                       // for the csv
    site.pageUrlByIndex[newIndex] = ppUrl; // what TODO about ppUrl                                     // and the reverse lookup

}

function fileout(data,filename) {
    $.ajax({
        url: "fileops.php",
        global: false,
        type: "POST",
        data: { mode : 'fileJSON', text : data, name : filename },
        dataType: "html",
        async: false,
        success: function(msg) {
            alert(msg);
        }
    });
}

function filein(filename) {
    $.ajax({
        url: "fileops.php",
        global: false,
        type: "POST",
        data: { mode : 'getfile', text : data, name : filename },
        dataType: "html",
        async: false,
        success: function(response) {
            return response;
        }
    });
}

function houseKeeping(page) {
    var urls = [];
    var text = page.text;
    //urlSets.push(
            //header.match(/['"][^\s'"]*?\/so4[^\s"']*?\/image\/[^'"]*/ig)
            //);
    var leadHash={},aHash={},bHash={},cHash={};
    var bUrls=[], cUrls=[];
    var cUrlsInContext=[];
    var cMash=[];
    var a,b,c,d,i;
    // get all the src, href, img, background, outurl, action, headerimage ulrs
    p1=/\w*(?!\w)\s*?=\s*?(['"])(http(s)?:\/\/|\/)\w[\w-\/.]*(?![\w-\/.])\1/ig; // this pattern targets normal urls
    p2=/\w*\s?(=|\()\s?(['"])(http(s)?:\/\/|\/|\/\/)\w[\w-/.&%?=]*?\2/ig;            // this one is for urls with arguments (ie queries)
    p3=/(["'])(http|\/)[^\1<>]*?\1/ig;                                          // this matches as much as it can and still be usefull

    a = page.text.match(p1);                                                    // keep in mind, none of these will catch
    b = page.text.match(p2);                                                    // malformed links with no quotes or no terminating /
    c = page.text.match(p3);                                                    // and this won't return links with no /

    // now we have collected all possible url strings (except malformed ulrs)
    // a is subset of b which is a subset of c
    // the leading src= and other statements are more for further verification
    // that these are indeed all urls - i will hash them and discard from a & b
    // i'd like to make a 3d array but i might just use a comma separated list

    //if(b.length != c.length){
        //fileout(b,'b.csv');
        //fileout(c,'c.csv');
        //alert("b.length != c.length");
    //}

    for(i=0;i<c.length;i++){
        if(i<a.length){
            leadHash[ a[i].match(/^\w*\s?=\s?/) ] = true;                                 // save the front bit for later
            aHash[ a[i].replace(/^\w*\s?=\s?/,"") ] = 'found';                           // then get rid of it for now
        }
        if(i<b.length){
            leadHash[ b[i].match(/^\w*\s?(=|\()\s?/) ] = true;
            bHash[ b[i].replace(/^\w*\s?(=|\()\s?/,"") ] = 'found';
        }
        cHash[ c[i] ] = 'found';
    }

    for(i in cHash){
        if(!cHash.hasOwnProperty(i)){
            break;
        }
        if(aHash[i] != 'found'){                                                // this means it's not in the a set
            if(bHash[i] != 'found'){                                            // this means it's not in the a or b sets
                var pattern = encodeRE(i);                                      // that is it's only in c set
                pattern = ".{3,100}"+pattern;                                   // meaning it's an anomaly
                pattern = new RegExp(pattern,"ig");                             // that being the case I retrieve some preceding
                cUrlsInContext.push(page.text.match(pattern));                  // characters to try and identify the anomaly
                if(!Site.cHashFull[i] || Site.cHashFull[i].status != 'found') {
                    Site.cHashFull[i] = {};
                    Site.cHashFull[i][ 'inContext' ] =
                        cUrlsInContext[cUrlsInContext.length-1];
                    Site.cHashFull[i][ 'status' ] = 'found';
                    Site.cHashFullCount++;
                    Site.allUrls[i] = 'c';
                    cUrls[i] = 'found';
                    Site.urlRejects[i] = 'rejected from set: c';
                }
            } else {                                                            // Otherwise, it's in the b-set
                // this urls is in both c and b sets
                bUrls.push[i] = 'found';
                Site.bUrls[i] = 'found';
                if(i.match(/^(['"])\/members\/[^\1]*\1/)){
                    urls.push(i);
                    Site.allUrls[i] = 'b, redirect';
                    Site.urlsToRedirect[i] = 'redirect';
                } else {
                    Site.urlRejects[i] = 'rejected from set: b';                // this is not redundant
                }
            }
        } else {
            // this urls belongs to all three sets
            Site.allUrls[i] = 'a';
            var pattern = new RegExp(encodeRE(site.root));
            if(i.match(pattern) ||                                              // just get the urls for the our domain
                    i.match(/www\.storesonline\.com/) ||                        // and these because SOL does a lot of internal redirection
                    i.match(/^['"]\/\w/) &&                                     // this test catches the relative urls
                   !i.match(/\.js['"]/)) {                                      // and this one takes out the javascript files
            // end of if(test) block of expressions
                Site.allUrls[i] = 'redirect';
                if(urls.length==1) {
                    alert(urls[0]+"   "+i);
                }urls.push(i);
                Site.urlsToRedirect[i] = 'redirect';
            } else {
                Site.urlRejects[i] = 'rejected from set: a';
            }
        }
        if(urls.length==1) {
            // I'm here to filter out the page urls (ie urls with no filename)
            var key = urls[0];                                                  // key because I hope to be rid of the url
            Site.urlsProcessed[key] = houseKeepersHelper(urls,page);            // pop goes the so it's length is never more than 1 long
            Site.urlsProcessedCount++;
            if(Site.urlsProcessed[key]) {
                Site.assetsRedirects[key] = page.name;
            } else {
                                                                                //Site.falseRedirects[key] = {};
                //Site.falseRedirects[key]['pageName'] = page.name;             // this mess of using urls[1] is ridiculous TODO
                Site.falseRedirects[key] = page.name;                           // this mess of using urls[1] is ridiculous TODO
            }
        } else {
            window.sodaPop += urls.toString();
        }
    }


    while(page.text.match(/NEW-PATH_PLACEHOLDER/g)) {
        page.text = page.text.replace(/NEW-PATH_PLACEHOLDER/g,
                site.assetsPath3dcart
            );
    }

}

function houseKeepersHelper(urls,page) {

    var solPics = "";
    var asset;
    for(i in urls) {
        urls[i] = urls[i].replace(/^(["'])(.*?)\1/g,"$2");
        if(isNaN(i)) {
            break;
        }
        asset = urls[i];                                                        // asset becomes the url we're processing
        solPics = urls[i] + "<br>";
        if( urls[i].match(/.*\/([^\s]*)/) ) {
            var target = urls[i].match(/.*\/([^\s'"]*)/);
            if(target && target.length > 1) {

                if(target[1].match(/\./)) {                                     // check for a period to guess if it's a file
                    var pattern = new RegExp(asset,"ig");
                    page.text = page.text.replace( pattern,
                            "NEW-PATH_PLACEHOLDER"+target[1]                    // placeholder so we don't find it again
                            );                                                  // then we'll replace it at the end
                    window.pt = page.text.match(
                            /.{100}new.path.placeholder.{100}/ig
                        );
                    // process the file
                    site.remembered[target[1]] = urls[i];                       // redundant
                    if(!Site.upldHash[asset])
                    {

                        Site.upldHash[asset] = true;                            // hashing makes history stop repeating
                        site.assets.push(asset);

                        // now the fun part - we're preloading the content
                        var preloaded = new Image();
                        if(preloaded.src.indexOf('http') != 0) {
                            preloaded.src = "http://www.storesonline.com" + asset;                  // and the content gets loaded into the cache
                        } else {
                            alert(asset);
                        }
                        $("#result0").append("<br>"+asset+"<br>");
                        $("#result0").append(
                            "has been loaded into the cache for download"+
                            "<br>"
                        );
                        $('#result0').append(preloaded);                        // to be later downloaded in one batch by 'save as'
                        Site.solPics.push(solPics);
                        if(window.urlPopHouse = urls.pop()) {
                            var oldPath = urlPopHouse;
                            var newPath = site.assetsPath3dcart + target[1];
                            site.redirects2.push(oldPath+","+newPath);
                            return 'urls has popped';
                        } else {
                            alert( 'url did not pop' );
                        }
                    } else {
                        urls.pop();
                        return 'this url has already been processed';
                    }// 'save as -> web page complete' to download it all
                } else {
                    Site.urlRejects[urls[i]] = urls.pop();                      // added this because I'm targeting the urls with filenames
                    return false;
                }                                                               // however these urls should be crossed checked
            }                                                                   // against the redirect table in postProc
        }
    }
}

function genTMPredirects(page) {

  //  if(!page.targets.length) {
  page.targets = site.targets.slice();
  //  }

  var tmUrls = page.url.match(
      site.tmMatch
  );

  if(!tmUrls) {

    var newIndex;
    var tmPage;

    while(page.targets.length) {

        page.url + '/' + page.targets.pop();        // old path

    }
  }
}

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

        newIndex = site.tmPages.push(tmPage) - 1; // add page to the stack being processed
        site.tmPageIndexByUrl[tmPage.url] = newIndex;     // index is length -1
        site.tmPageUrlByIndex[newIndex] = tmPage.url;     // and the reverse lookup
        page.noTm = "exempt";                           // just an extra precaution
      }
    }
  }
}


