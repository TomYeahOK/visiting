//13:49

/*jslint browser: true*/
/*global $, jQuery, alert*/

var mapversion = "";

var btnDecodebutton = "";
var tbCampus = "";
var tbBuilding = "";
var tbRoom = "";
var tbUsrPostcode = "";

var tbSearchbar = "";
var btnSearchSubmit = "";
var btnSearchCampusHC = "";
var btnSearchCampusCC = "";
var btnSearchCampusCAR = "";
var btnSearchCampusClass = "";
var btnClearCampus = "";

var btnTransport = "";
var btnCampusMap = "";
var aInferCampus = "";
var divPrompt = "";

var divPresets = "";
var setGeneralSearch = "";
var setSearchCampus = "";
var setPresets = "";
var setLayers = "";
var setRoomfinder = "";

var relatedSiteWrap = "";
var spRelatedKeyword = "";
var spRelatedUrl = "";
var aRelatedUrl = "";

var btnTransportLayer = "";
var labelTransportLayer = "";

var transportlayer = {};
var adhoclayer = {};
var roomfinderlayer = {};


var map;
var searchterm;
var adhocclause;
var campusexists = "";
var buildingexists = "";
var verifiedcampuscode = "";
var verifiedbuildingcode = "";
var campusmapurl = "";
var plainspeakcampus = "";
var plainspeakbuilding = "";
var destpostcode = "";
var addressextra = "";
var zoomlevel = 12;
var searchmodecentre = "LEEDS";
var campus = "";
var layertoupdate = "";

var buildingdata = [];
var autobuild = [];
var secondarybuildingdata = [];
var campuscodes = [];
var autocampus = [];

var relatedurl = "";
var relatedkeyword = "";
var namedroomsautocomplete = [];

//Load the map and call in settings 
function initialize() {

    google.maps.visualRefresh = true;
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(53.803388067419895, -1.5543937683105469),
        zoom: zoomlevel,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //Infowindow
    google.maps.event.addListener(adhoclayer, 'click', function (e) {
        // Change the content of the InfoWindow

        var infowindowaddress = e.row['Address'].value.replace(/\,/g, '<br>');
        e.infoWindowHtml = "<h2 class='aveny'>" + e.row['Name'].value + "</h2><br>";
        e.infoWindowHtml += infowindowaddress + "<br>";
        e.infoWindowHtml += e.row['Postcode'].value + "<br>";

        if (e.row['Campus'].value === 'CC') {
            e.infoWindowHtml += "at City Campus";
        }

        if (e.row['Campus'].value === 'HC') {
            e.infoWindowHtml += "at Headingley Campus";
        }

        if (relatedurl !== "") {
            e.infoWindowHtml += "<span class='infowindowmeta'>Visit our <a href='" + relatedurl + "'>" + relatedkeyword + "</a> minisite</span>";
        }

    });

    google.maps.event.addListener(roomfinderlayer, 'click', function (e) {
        // Change the content of the InfoWindow

        var infowindowaddress = e.row['Address'].value.replace(/\,/g, '<br>');
        e.infoWindowHtml = "<h2 class='aveny'>" + e.row['Name'].value + "</h2><br>";
        e.infoWindowHtml += infowindowaddress + "<br>";
        e.infoWindowHtml += e.row['Postcode'].value + "<br>";

        if (e.row['Image'].value) {
            e.infoWindowHtml += "<img src='" + e.row['Image'].value + "'/><br>";
        }

        if (e.row['Description'].value) {
            e.infoWindowHtml += e.row['Description'].value + "<br>";
        }

        if (e.row['Campus'].value === 'CC') {
            e.infoWindowHtml += "at City Campus";
        }

        if (e.row['Campus'].value === 'HC') {
            e.infoWindowHtml += "at Headingley Campus";
        }

        if (relatedurl !== "") {
            e.infoWindowHtml += "<span class='infowindowmeta'>Visit our <a href='" + relatedurl + "'>" + relatedkeyword + "</a> minisite</span>";
        }

    });


    //Map Layers Predefinitions    

    //Totally predefined Transport layer - Can be activated and deactivated independantly.
    transportlayer = new google.maps.FusionTablesLayer({
        query: {
            select: "col2",
            from: "1Z1hWme6vjtiVJ98H8-cj_IYdDL6VHcAqj3KNlec",
            where: "col13 contains ignoring case 'travel'"
        },
        map: map,
        styleId: 2,
        templateId: 2
    });

    //Constant attributes of the adhoc layer
    adhoclayer = new google.maps.FusionTablesLayer({
        query: {
            select: "col2",
            from: "1Z1hWme6vjtiVJ98H8-cj_IYdDL6VHcAqj3KNlec",
            where: "col13 contains ignoring case 'xxxx'"
        },
        map: map,
        styleId: 2,
        templateId: 2
    });

    //Constant attributes of the roomfinder layer
    roomfinderlayer = new google.maps.FusionTablesLayer({
        query: {
            select: "col2",
            from: "1Z1hWme6vjtiVJ98H8-cj_IYdDL6VHcAqj3KNlec",
            where: "col13 contains ignoring case 'xxxx'"
        },
        map: map,
        styleId: 2,
        templateId: 2
    });
    
    //transportlayer's showing - Hide it initially.
    transportlayer.setMap(null);

}





function getUrlVars() {
    var urlvars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        urlvars.push(hash[0]);
        urlvars[hash[0]] = hash[1];
    }
    return urlvars;
}

function addvars() {
    var mode = getUrlVars()["mode"];
    if (mode === 'roomfinder') {

        var urlroomcode = getUrlVars()["rc"];

        if (urlroomcode) {

            urlroomcodesplit = urlroomcode.split("+");

            $(tbCampus).val(urlroomcodesplit[0]);
            $(tbBuilding).val(urlroomcodesplit[1]);
            $(tbRoom).val(urlroomcodesplit[2]);

        }

        //Load into Roomfinder Mode:	
        $('#roomfinder').toggleClass('activemode');
        $("#roomfinder").toggleClass('active');
        $("#roomfinder").children('.guts').fadeToggle(600, 'linear');
        $("#initialprompt").fadeToggle(300);
        $("#initialprompt").toggleClass('active', 300);
        $(".init").toggleClass('active');
        $("#campusnavigator").removeClass('initial');

        addlayer('', roomfinderlayer, adhoclayer);

        $(btnDecodeButton).delay(1000).trigger('click');


    } else if (mode === 'search') {


        var sq = getUrlVars()["sq"];
        var preset = getUrlVars()["preset"];
        if (sq) {
            var sqnospace = sq.replace('%20', ' ');
            $(tbSearchbar).val(sqnospace);


        }

        if (preset) {
            var presetwspace = preset.replace('%20', '-').toLowerCase();
            $('label#' + presetwspace + '-label').click();
            return
        }

        $("div.presets").appendTo($('div.presetsmoved'));
        $('#generalsearch').toggleClass('activemode');
        $("#generalsearch").toggleClass('active');
        $("#generalsearch").children('.guts').toggle();
        $("#initialprompt").toggle();
        $("#initialprompt").toggleClass('active');
        $(".init").toggleClass('active');
        $("#campusnavigator").removeClass('initial');

        addlayer('', adhoclayer, roomfinderlayer);
        $(btnDecodeButton).delay(1000).trigger('click');
    }
}





function initializeMobile() {

    addvars();
}


function initializeDesktop() {
    google.maps.event.addDomListener(window, 'load', initialize);
    addvars();

    //Mode Toggler
    $('div.map-aside-section').click(function () {

        //If already active, do nothing.
        if ($(this).hasClass('activemode')) {}

        //If inactive and initial prompt is still there, activate This, and hide the initial prompt.
        else if ($("#initialprompt").hasClass('active')) {



            $(this).toggleClass('activemode');
            $(this).children('.guts').fadeToggle(600, 'linear');
            $(this).toggleClass('active', 700);

            //Destroy Initial Elements
            $(".init").toggleClass('active');
            $("#initialprompt").fadeToggle(100);
            $("#initialprompt").toggleClass('active', 100);
            $("#campusnavigator").delay(700).removeClass('initial', 100);


            if ($(this).hasClass('roomfinder')) {
                addlayer('', roomfinderlayer, adhoclayer);
                movemap('', verifiedcampuscode);
            } else if ($(this).hasClass('generalsearch')) {
                $("div.presets").appendTo($('div.presetsmoved'));
                addlayer('', adhoclayer, roomfinderlayer);
                movemap('togglesearchmode', '');
            }

        }

        //If inactive, and initial prompt is already gone, simple toggle.
        else {
            $('div.map-aside-section').toggleClass('activemode');
            $('div.map-aside-section').children('.guts').fadeToggle(600, 'linear');
            $('div.map-aside-section').toggleClass('active', 700);

            if ($(this).hasClass('roomfinder')) {
                $("div.presets").appendTo($('div.presetsreturn'));
                addlayer('', roomfinderlayer, adhoclayer);
                movemap('', verifiedcampuscode);
            } else if ($(this).hasClass('generalsearch')) {
                $("div.presets").appendTo($('div.presetsmoved'));
                addlayer('', adhoclayer, roomfinderlayer);
                movemap('togglesearchmode');
            }
        }
    });

    //Initial prompt bonus functions, for choosing a mode
    $('#init-generalsearch').click(function () {
        $("div.presets").appendTo($('div.presetsmoved'));
        $('#generalsearch').toggleClass('activemode');
        $("#generalsearch").toggleClass('active', 700);
        $("#generalsearch").children('.guts').fadeToggle(600, 'linear');
        $("#initialprompt").fadeToggle(300);
        $("#initialprompt").toggleClass('active', 300);
        $(".init").toggleClass('active');
        $("#campusnavigator").delay(700).removeClass('initial', 100);
    });

    $('#init-roomfinder').click(function () {
        $('#roomfinder').toggleClass('activemode');
        $("#roomfinder").toggleClass('active');
        $("#roomfinder").children('.guts').fadeToggle(600, 'linear');
        $("#initialprompt").fadeToggle(300);
        $("#initialprompt").toggleClass('active', 300);
        $(".init").toggleClass('active');
        $("#campusnavigator").removeClass('initial');
    });

    //UI var Definitions
    btnDecodeButton = '#decodebutton';
    tbCampus = '#tb-campus';
    tbBuilding = '#tb-building';
    tbRoom = '#tb-room';
    tbUsrPostcode = '#tb-usrpostcode';

    tbSearchbar = '#searchbar';
    btnSearchCampusHC = '#campus-HC-r';
    btnSearchCampusCC = '#campus-CC-r';
    btnSearchCampusCAR = '#campus-CAR-r';
    btnSearchCampusClass = '.campus-select';
    btnSearchSubmit = '#searchsubmit';
    btnClearCampus = '#campus-select-clear';

    btnTransport = '.transportbutton';
    btnCampusMap = '#campusmap';
    aInferCampus = 'a#infercampus';
    divPrompt = '#prompt';

    setGeneralSearch = '#generalsearch';
    setSearchCampus = '#searchcampus';
    divPresets = '.presets';
    setLayers = '.layers';
    setRoomfinder = '#roomfinder';

    relatedSiteWrap = "#relatedsite";
    spRelatedKeyword = ".relatedkeyword";
    spRelatedUrl = "span#relatedurl";
    aRelatedUrl = 'a#relatedurl';

    btnTransportLayer = '#transport-cb';
    labelTransportLayer = '#transporttoggle';

    //uibinding is externalized for the time being, but will be brought into this function
    uibinding();
}



campuscodes.push(["HC", "Headingley Campus", "headingley.pdf"]);
campuscodes.push(["CC", "City Campus", "city.pdf"]);
campuscodes.push(["AC", "Accommodation", "all.pdf"]);
campuscodes.push(["HS", "Headingley Stadium", "carnegie.pdf"]);

buildingdata.push(["CC", "BPB", "Broadcasting Place - Arts", "LS2 9EN", "Woodhouse Lane"]);
buildingdata.push(["CC", "BPA", "Broadcasting Place - Humanities Building", "LS2 9EN", "Woodhouse Lane"]);
buildingdata.push(["CC", "CL", "Calverley Building", "LS1 3HE", "Portland Way"]);
buildingdata.push(["CC", "CCP", "Car Park", "LS1 3HB", "Portland Crescent"]);
buildingdata.push(["CC", "CHC", "Cloth Hall Court", "LS1 2HA", "Quebec Street"]);
buildingdata.push(["CC", "EP", "Electric Press", "LS2 3AD", "1 Millennium Square", "1 Millenium Square"]);
buildingdata.push(["CC", "LSB", "Leslie Silver Building", "LS1 3ES", "Woodhouse Lane"]);
buildingdata.push(["CC", "NT", "Northern Terrace", "LS2 8AG", "Queen Square Court"]);
buildingdata.push(["CC", "OBH", "Old Broadcasting House", "LS2 9EN", "Woodhouse Lane"]);
buildingdata.push(["CC", "PD", "Portland Building", "LS1 3HE", "Portland Way"]);
buildingdata.push(["CC", "QSH", "Queen Square House", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS08", "8 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS09", "9 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS10", "The Wellness Centre, 10 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS14", "14 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS15", "Qu2 Leeds, 15 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS16", "16 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "QS17", "17 Queen Square", "LS2 8NU", "Queen Square"]);
buildingdata.push(["CC", "RB", "Rose Bowl", "LS1 3HB", "Portland Crescent"]);
buildingdata.push(["CC", "WB", "Woodhouse Building", "LS1 3ES", "Woodhouse Lane"]);
// Headingley Campus
buildingdata.push(["HC", "BR", "Bronte Hall", "LS6 3QW", "Church Wood Avenue"]);
buildingdata.push(["HC", "CAE", "Caedmon Hall", "LS6 3QR", "Church Wood Avenue"]);
buildingdata.push(["HC", "CC", "Campus Central", "LS6 3HJ", "Church Wood Avenue"]);
buildingdata.push(["HC", "HCP", "Car Park", "LS6 3QS", "Church Wood Avenue"]);
buildingdata.push(["HC", "CAN", "Carnegie Annexe - Carnegie Sports Reception", "LS6 3QQ", "Church Wood Avenue"]);
buildingdata.push(["HC", "CAR", "Carnegie Hall", "LS6 3QQ", "Church Wood Avenue"]);
buildingdata.push(["HC", "TC", "Carnegie Regional Indoor Tennis Centre", "LS6 3QS", "Church Wood Avenue"]);
buildingdata.push(["HC", "CRI", "Carnegie Research Institute", "LS6 3QQ", "Church Wood Avenue"]);
buildingdata.push(["HC", "CV", "Cavendish Hall", "LS6 3QU", "Church Wood Avenue"]);
buildingdata.push(["HC", "CW", "Churchwood Hall", "LS6 3QJ", "Church Wood Avenue"]);
buildingdata.push(["HC", "DT", "Design Technology Centre", "LS6 3QT", "Church Wood Avenue"]);
buildingdata.push(["HC", "FF", "Fairfax Hall", "LS6 3QT", "Church Wood Avenue"]);
buildingdata.push(["HC", "JG", "James Graham Building", "LS6 3HF", "Church Wood Avenue"]);
buildingdata.push(["HC", "JM", "Campus Central", "LS6 3HJ", "Church Wood Avenue"]);
buildingdata.push(["HC", "LE", "Landscape Lecture Building", "LS6 3GZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "LE", "Leighton Hall", "LS6 3QS", "Church Wood Avenue"]);
buildingdata.push(["HC", "MC", "Macaulay Hall", "LS6 3QN", "Church Wood Avenue"]);
buildingdata.push(["HC", "NL", "North Lodge", "LS6 3QH", "Church Wood Avenue"]);
buildingdata.push(["HC", "PR", "Priestley Hall", "LS6 3QL", "Church Wood Avenue"]);
buildingdata.push(["HC", "QH", "Queenswood", "LS6 3QL", "Church Wood Avenue"]);
buildingdata.push(["HC", "SCN", "Security Cabin North Entrance", "LS6 3QS", "Church Wood Avenue"]);
buildingdata.push(["HC", "SL", "South Lodge", "LS6 3QH", "Church Wood Avenue"]);
buildingdata.push(["HC", "SCB", "Sports Centre - Blue", "LS6 3QQ", "Church Wood Avenue"]);
buildingdata.push(["HC", "SCG", "Sports Centre - Green", "LS6 3QQ", "Church Wood Avenue"]);
buildingdata.push(["HC", "CC", "Student Hub (Headingley)", "LS6 3HJ", "Church Wood Avenue"]);
buildingdata.push(["HC", "SUH", "Students' Union", "LS6 3HJ", "Church Wood Avenue"]);
buildingdata.push(["HC", "DS", "Swimming Pool", "LS6 3QQ", "Church Wood Avenue"]);
buildingdata.push(["HC", "CH", "The Coach House", "LS6 3QU", "Church Wood Avenue"]);
buildingdata.push(["HC", "CO", "The Cottage", "LS6 3QS", "Church Wood Avenue"]);
buildingdata.push(["HC", "CC", "The Food Court", "LS6 3HJ", "Church Wood Avenue"]);
buildingdata.push(["HC", "GR", "The Grange", "LS6 3QX", "Church Wood Avenue"]);
//Carnegie Stadium
buildingdata.push(["HS", "CPV", "Carnegie Pavilion", "LS6 3DP", "North Lane"]);
buildingdata.push(["HS", "HCS", "Headingley Stadium / Stand", "LS6 3BR", "St Michael's Lane"]);
// Accommodations
buildingdata.push(["AC", "CH", "Carlton Hill", "LS7 1JA", "Carlton Hill"]);
buildingdata.push(["HC", "CAV", "Carnegie Village", "LS6 3GZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "ACV", "Carnegie Village - Aire", "LS6 3QZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "CCV", "Carnegie Village - Calder", "LS6 3QZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "DCV", "Carnegie Village - Don", "LS6 3QZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "NCV", "Carnegie Village - Nidd", "LS6 3QZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "SCV", "Carnegie Village - Swale", "LS6 3QZ", "Church Wood Avenue"]);
buildingdata.push(["HC", "WCV", "Carnegie Village - Wharfe", "LS6 3QZ", "Church Wood Avenue"]);
buildingdata.push(["AC", "KB", "Kirkstall Brewery", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBA", "Kirkstall Brewery - Abbey House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBCO", "Kirkstall Brewery - Cooper House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBD", "Kirkstall Brewery - Dawson House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBE", "Kirkstall Brewery - Elsworth House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBGA", "Kirkstall Brewery - Graham House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBGO", "Kirkstall Brewery - Grove House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBMA", "Kirkstall Brewery - Maltings", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBMO", "Kirkstall Brewery - Monkwood", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBMU", "Kirkstall Brewery - Musgrave House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBOA", "Kirkstall Brewery - Oak House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBOM", "Kirkstall Brewery - Olive Mount House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBP", "Kirkstall Brewery - Poplar", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBS", "Kirkstall Brewery - Spring", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBTO", "Kirkstall Brewery - The Tower", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBWL", "Kirkstall Brewery - Walker House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBWR", "Kirkstall Brewery - Warehouse", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "KBWI", "Kirkstall Brewery - Whitbread House", "LS5 3RX", "Broad Lane"]);
buildingdata.push(["AC", "MS", "Mill Street", "LS9 8NA", "1 Mill Street"]);
buildingdata.push(["AC", "OPAL", "Opal Court", "LS3 1LS", "1-3 Burley Road"]);
buildingdata.push(["AC", "RPF", "Royal Park Flats", "LS6 1JJ", "Royal Park Road"]);
buildingdata.push(["AC", "SWC", "Sugarwell Court", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCA", "Sugarwell Court - Airedale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCB", "Sugarwell Court - Bishopdale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCC", "Sugarwell Court - Coverdale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCD", "Sugarwell Court - Deepdale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCE", "Sugarwell Court - Eskdale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCF", "Sugarwell Court - Farndale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "SCG", "Sugarwell Court - Glaisdale", "LS7 2DJ", "Meanwood Road"]);
buildingdata.push(["AC", "WHF", "Woodhouse Flats", "LS2 9EQ", "St Mark's Street"]);
buildingdata.push(["AC", "WFA", "Woodhouse Flats - Flat A", "LS2 9EQ", "St Mark's Street"]);
buildingdata.push(["AC", "WFB", "Woodhouse Flats - Flat B", "LS2 9EQ", "St Mark's Street"]);
buildingdata.push(["AC", "WFC", "Woodhouse Flats - Flat C", "LS2 9EQ", "St Mark's Street"]);
buildingdata.push(["AC", "WFD", "Woodhouse Flats - Flat D", "LS2 9EQ", "St Mark's Street"]);

var searchdata = [];
var autosearchbuild = [];
var namedrooms = [];
var usrcampuscode = "";

searchdata.push(["Accommodation", "http://leedsmet.ac.uk/accommodation", "Accommodation"]);
searchdata.push(["Aire"]);
searchdata.push(["Applicant Open Day"]);
searchdata.push(["Architecture"]);
searchdata.push(["Art"]);
searchdata.push(["AV Loans"]);
searchdata.push(["Baby Changing"]);
searchdata.push(["Bar"]);
searchdata.push(["Breakfast"]);
searchdata.push(["Built Environment"]);
searchdata.push(["Business Start-Up"]);
searchdata.push(["Cafe"]);
searchdata.push(["Calder"]);
searchdata.push(["Campus Services"]);
searchdata.push(["Campus Shop"]);
searchdata.push(["Campus Tour"]);
searchdata.push(["Car Park"]);
searchdata.push(["Careers"]);
searchdata.push(["Carnegie Faculty"]);
searchdata.push(["Carnegie Research Institute (CRI)"]);
searchdata.push(["Cash"]);
searchdata.push(["Cash machine"]);
searchdata.push(["Chicken Shack"]);
searchdata.push(["Coffee"]);
searchdata.push(["Computers"]);
searchdata.push(["Conferencing Venues"]);
searchdata.push(["Cultural Studies"]);
searchdata.push(["Design and Technology Centre"]);
searchdata.push(["Disability Services"]);
searchdata.push(["Don"]);
searchdata.push(["Drink"]);
searchdata.push(["Dyslexia"]);
searchdata.push(["Engineering"]);
searchdata.push(["Events, Tourism & Hospitality"]);
searchdata.push(["Experimental Gardens"]);
searchdata.push(["Faculty of Arts, Environment, Technology"]);
searchdata.push(["Faculty of Business & Law"]);
searchdata.push(["Faculty of Health & Social Sciences"]);
searchdata.push(["FE college partnerships"]);
searchdata.push(["Film"]);
searchdata.push(["Financial Services"]);
searchdata.push(["Fitness"]);
searchdata.push(["Food"]);
searchdata.push(["Food Court"]);
searchdata.push(["Fuel"]);
searchdata.push(["Getting Sorted"]);
searchdata.push(["Gym"]);
searchdata.push(["Information"]);
searchdata.push(["International Office"]);
searchdata.push(["International Volunteering"]);
searchdata.push(["IT lab"]);
searchdata.push(["Jean Monnet Building"]);
searchdata.push(["Jobshop"]);
searchdata.push(["Landscape Resource Centre"]);
searchdata.push(["Languages"]);
searchdata.push(["Law"]);
searchdata.push(["Library"]);
searchdata.push(["Lost Property"]);
searchdata.push(["Lunch"]);
searchdata.push(["Marketing"]);
searchdata.push(["Money advice"]);
searchdata.push(["More Life"]);
searchdata.push(["Music"]);
searchdata.push(["Nidd", "http://leedsmet.ac.uk/accommodation", "Accommodation"]);
searchdata.push(["Northern Film School"]);
searchdata.push(["Nti Leeds"]);
searchdata.push(["Open Day"]);
searchdata.push(["Parking"]);
searchdata.push(["Performing Arts"]);
searchdata.push(["Post Office"]);
searchdata.push(["Prayer"]);
searchdata.push(["Printing"]);
searchdata.push(["QU2"]);
searchdata.push(["Railway"]);
searchdata.push(["Recording Studio"]);
searchdata.push(["Security"]);
searchdata.push(["Station"]);
searchdata.push(["Student Hub"]);
searchdata.push(["Student Services"]);
searchdata.push(["Students' Union (SU)"]);
searchdata.push(["Swale", "http://leedsmet.ac.uk/accommodation", "Accommodation"]);
searchdata.push(["Swimming Pool"]);
searchdata.push(["Taxi Pickup/Drop-off"]);
searchdata.push(["The Coach House"]);
searchdata.push(["Train"]);
searchdata.push(["Transport"]);
searchdata.push(["Travel"]);
searchdata.push(["Tuition Fees"]);
searchdata.push(["University Research Office"]);
searchdata.push(["University Sport"]);
searchdata.push(["Wellbeing"]);
searchdata.push(["Wellness Centre"]);
searchdata.push(["Wharfe"]);


namedrooms.push(["Lewis Jones Suite", "CPV", "LJS"]);
namedrooms.push(["Gandhi Hall", "JG", "GH"]);
namedrooms.push(["The Great Hall", "JG", "GH"]);
namedrooms.push(["Jubilee Room", "JG", "JR"]);
namedrooms.push(["Legends Suite", "HCS", "LS"]);
namedrooms.push(["Taverners Suite", "HCS", "TS"]);
namedrooms.push(["Executive Suite", "HCS", "ES"]);
namedrooms.push(["Premier Suite", "HCS", "PS"]);
namedrooms.push(["The Long Bar", "HCS", "TLB"]);
namedrooms.push(["The Boardroom", "HCS", "BR"]);

//RoseBowl
namedrooms.push(["Lecture Theatre D", "RB", "538"]);
namedrooms.push(["Lecture Theatre E", "RB", "539"]);
namedrooms.push(["Lecture Theatre F", "RB", "545"]);
namedrooms.push(["Lecture Theatre G", "RB", "546"]);
namedrooms.push(["Boardroom", "RB", "522"]);
namedrooms.push(["Sagar Wright Lecture Theatre B", "RB", "437"]);
namedrooms.push(["Lecture Theatre C", "RB", "444"]);
namedrooms.push(["News Room & PR Studio", "RB", "316"]);
namedrooms.push(["Sagar Wright Lecture Theatre A", "RB", "241"]);
namedrooms.push(["Student Services", "RB", "148"]);

//BINDINGS

function uibinding() {
    //Prebuild Autocompletes
    //Building Box
    for (i = 0; i < buildingdata.length - 1; i++) {
        autobuild.push({
            value: "" + buildingdata[i][1] + "",
            label: "" + buildingdata[i][2] + " - " + buildingdata[i][1] + ""
        });
        secondarybuildingdata.push({
            value: "" + buildingdata[i][1] + "",
            label: "" + buildingdata[i][2] + " - " + buildingdata[i][1] + ""
        });

        //Alphabetise it by building name
        secondarybuildingdata.sort(function (a, b) {
            var textA = a.label.toUpperCase();
            var textB = b.label.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    //CampusBox
    for (i = 0; i < campuscodes.length; i++) {
        autocampus.push({
            value: "" + campuscodes[i][0] + "",
            label: "" + campuscodes[i][1] + " - " + campuscodes[i][0] + ""
        });
    }

    //Searchbar
    for (i = 0; i < searchdata.length - 1; i++) {
        autosearchbuild.push({
            value: "" + searchdata[i][0] + "",
            label: "" + searchdata[i][0] + ""
        });
    }


    $(tbCampus).keyup(function () {
        //verifycampuscode("campuskeyup");
        nextbox(this, tbBuilding, 1);
    });


    $(tbCampus).autocomplete({
        source: autocampus,
        select: function (e, ui) {
            verifycampuscode("campuskeyup", ui.item.value);
            nextbox(this, tbBuilding, "");
        },
        minLength: 0
    }).bind('focus', function () {
        $(this).autocomplete("search");

    });


    $(tbBuilding).autocomplete({
        source: secondarybuildingdata,
        select: function (e, ui) {
            roomautocomplete(ui.item.value);
            nextbox(this, "tb-room", "");
        },
        minLength: 0
    }).bind('focus', function () {
        $(this).autocomplete("search");
    }).bind('focus', function () {
        $(this).tooltip("close");
    }).bind('focus', function () {
        verifycampuscode("campuskeyup");
    });

    $(tbBuilding).keyup(function (event) {
        roomautocomplete();

        if (event.keyCode == 13) {
            decoderoomcode();
            $(tbBuilding).autocomplete("close");
        }
    });

    $(tbRoom).keyup(function (event) {
        if (event.keyCode == 13) {
            decoderoomcode();
        }
    });

    $(tbRoom).autocomplete({
        source: namedroomsautocomplete

    }).bind('focus', function () {
        $(this).autocomplete("search");
    });
    $(tbUsrPostcode).keyup(function () {
        buildtransportlink();
    });

    $(tbSearchbar).keyup(function (event) {
        if (event.keyCode == 13) {
            changequery('searchsubmit', 'x', adhoclayer);
            $(tbSearchbar).autocomplete("close");
        }
    });

    $(tbSearchbar).autocomplete({
        select: function (event, ui) {
            changequery('autocompbox', ui.item.value, adhoclayer);
        },
        source: autosearchbuild
    });


    $(btnDecodeButton).click(function (event) {
        event.preventDefault();
        decoderoomcode();
    });

    $(btnSearchSubmit).click(function (event) {
        event.preventDefault();
        changequery('searchsubmit', 'x', adhoclayer);
    });

    $(btnSearchCampusHC).click(function (event) {
        movemap('searchmode-campus', 'HC');
    });

    $(btnSearchCampusCC).click(function (event) {
        movemap('searchmode-campus', 'CC');
    });

    $(btnSearchCampusCAR).click(function (event) {
        movemap('searchmode-campus', 'CAR');
    });

    $(btnClearCampus).click(function (event) {
        event.preventDefault();
        movemap('campus-select-clear', 'LEEDS');
    });


    $(btnTransportLayer).click(function (event) {
        addlayer(btnTransportLayer, transportlayer);
    });


    //jQueryUI  Bindings:
    $(setGeneralSearch).buttonset();
    $(setSearchCampus).buttonset();
    $(setPresets).buttonset();
    $(setLayers).buttonset();
    $(setGeneralSearch + "input:radio").on({
        click: function () {
            return false;
        }
    });

    $(setRoomfinder).buttonset();
    $(tbBuilding).tooltip({
        position: {
            my: "center bottom-10",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $(this).css({
                    'font-size': '0.5em'
                })
                $("<div>")
                    .addClass("tb-building-tooltip")
            }
        }
    });

    $(btnTransport).button("disable");
    $(btnCampusMap).button("disable");
    $(setLayers).buttonset();
    $(aRelatedUrl).button('destroy');


}




function nextbox(fldobj, jumpto, maxlength, specialinstruction) {
    if (maxlength == "") {
        $(jumpto).focus();
    } else if (fldobj.value.length > maxlength) {
        $(jumpto).focus();
    }
}



//Generic function to enable adding layers - Used for Transport Layer
//USE SPARINGLY - Amount of layers is limited
//Where Possible use an updated adhoc layer
function addlayer(layerswitchid, layertoadd, layertoremove) {

    if (layerswitchid) {
        //alert($(layerswitchid).type());

        //Handle layer additions from checkboxes differently
        if ($(layerswitchid).attr('type') == 'checkbox') {
            if ($(layerswitchid).prop('checked')) {

                layertoadd.setMap(map);

                if (layerswitchid == btnTransportLayer) {

                    $(labelTransportLayer + ' span').text('Hide Transport Links');
                }

            } else {
                layertoadd.setMap(null);
                if (layerswitchid == btnTransportLayer) {
                    $(labelTransportLayer + ' span').text('Show Transport Links');
                }

            }
        }

    }

    //Handle direct instructions to toggle layers
    else {
        layertoadd.setMap(map);
        layertoremove.setMap(null);
    }

};



//Move Map Centre to predefined positions and zoom levels
function movemap(trigger, campus) {

    //if being told to re-center because the mode has been switched to the search mode
    if (trigger == "togglesearchmode") {
        movemap('', searchmodecentre);
    }

    //Dump the campus sent from the searchmode
    if (trigger == 'searchmode-campus') {
        searchmodecentre = campus;
    }

    if (trigger == "campus-select-clear") {
        var ele = document.getElementsByName("campus-select");
        for (var i = 0; i < ele.length; i++)
            ele[i].checked = false;
        searchmodecentre = "LEEDS";

        $(btnSearchCampusClass).removeAttr('checked');
        // Refresh the jQuery UI buttonset.                  
        $(setSearchCampus).buttonset('refresh');
    }



    if (campus == "HC") {
        var center = new google.maps.LatLng(53.82629278228646, -1.5926742553710938);
        var zoomlevel = 16;

    }

    if (campus == "CC") {
        var center = new google.maps.LatLng(53.80085359105726, -1.5485572814941406);
        var zoomlevel = 15;

    }

    if (campus == "CAR" || campus == "CP" || campus == "HS") {
        var center = new google.maps.LatLng(53.818528371649386, -1.5822887420654297);
        var zoomlevel = 16;

    }


    if (campus == "null" || campus == "LEEDS" || campus == undefined) {
        var center = new google.maps.LatLng(53.803388067419895, -1.5543937683105469);
        var zoomlevel = 12;

    }


    if (campus) {
        map.panTo(center);
        map.setZoom(zoomlevel);
    }
};


//layer query modifier
function changequery(formitem, searchterm, layertoupdate) {
    //constant prefix of adhocclause - Hardcoded to only search col13
    var adhocclause;
    var searchboxqueryintro = '\"col13 contains ignoring case \'';
    var roomfinderqueryintro = '\"col8 = \'';


    if (formitem == "decode-button") {
        adhocclause = roomfinderqueryintro + searchterm + '\'\"';
    }



    //Changing query from searchbox via Autocomplete, Go Button, or Hitting enter? Check for any special sites:
    else if (formitem == "searchsubmit" || formitem == "autocompbox" || formitem == "radio-preset") {
        //Now append the rest of the query from either the radio button or the searchbox
        if (formitem == "searchsubmit") {
            //Tell it to get the searchvalue from the searchbar
            var searchterm = $(tbSearchbar).val();
        }

        //Append the value of the searchbox contents to the clause
        adhocclause = searchboxqueryintro + searchterm + '\'\"';

        //Check against searchdata array tfor related minisites
        for (i = 0; i < searchdata.length; i++) {

            if (searchdata[i][0] == searchterm) {
                if (searchdata[i][1]) {

                    relatedurl = searchdata[i][1];
                    relatedkeyword = searchdata[i][2];
                    $(relatedSiteWrap).show();
                    $(spRelatedKeyword).text(relatedkeyword);
                    $(spRelatedUrl).text(relatedurl);
                    $(aRelatedUrl + "[href]").attr('href', relatedurl)
                } else {
                    relatedurl = "";
                    relatedkeyword = "";
                    $(relatedSiteWrap).hide();
                }
            }
        }

        //Everything other than the radio-presets needs to clear off the radio presets' values:    
        if (formitem != "radio-preset") {

            var ele = document.getElementsByName("1");
            for (var i = 0; i < ele.length; i++)
                ele[i].checked = false;
            $(setPresets + ' input').removeAttr('checked');
            // Refresh the jQuery UI buttonset.                  
            $(setPresets).buttonset('refresh');

        }

    } else {
        //Append the radio item's search value to the clause 
        adhocclause = searchboxqueryintro + searchterm + '\'\"';
    }

    //Feed query into the layer options
    layertoupdate.setOptions({
        query: {
            select: "col2",
            from: "1Z1hWme6vjtiVJ98H8-cj_IYdDL6VHcAqj3KNlec",
            where: adhocclause
        },
        map: map,
        styleId: 2,
        templateId: 2
    });

};



//Rebuild the autocomplete array for the second box
//Only if we determined that the campus is correct.
//NB Manual campuspush is used here to override the tb-camus value, because it needs to pull the value from the autocomplete selection.
function verifycampuscode(trigger, manualcampuspush) {
    usrcampuscode = $(tbCampus).val().toUpperCase();

    if (manualcampuspush) {
        usrcampuscode = manualcampuspush;
    }

    campusexists = "false";


    for (i = 0; i < campuscodes.length; i++) {
        if (campuscodes[i][0] == usrcampuscode) {
            campusexists = "true";
            plainspeakcampus = campuscodes[i][1];
            campusmapurl = campuscodes[i][2];

        }

    }

    if (campusexists == "true") {
        verifiedcampuscode = usrcampuscode;

    }


    if (trigger == "campuskeyup") {

        if (campusexists == "true") {
            autocompletearraybuild();
        } else {
            autocompletearraybuild("yes");
        }
    }
}


function verifybuildingcode(trigger) {

    var usrbuildingcode = $(tbBuilding).val().toUpperCase();
    buildingexists = "false";

    for (i = 0; i < buildingdata.length; i++) {
        if (buildingdata[i][1] == usrbuildingcode) {
            buildingexists = "true";
            plainspeakbuilding = buildingdata[i][2];
            destpostcode = buildingdata[i][3];

            if (buildingdata[i][4]) {
                addressextra = buildingdata[i][4];
            } else {
                addressextra = "";
            }

        }

    }

    if (buildingexists == "true") {
        verifiedbuildingcode = usrbuildingcode;

    }

}


function autocompletearraybuild(refill) {
    //Empty the array so we can do something with it
    secondarybuildingdata.length = 0;

    //If something tells it to, this will refill the autocomplete for the building box
    //EG if a correct Campus code is entered, and then an incorrect one, we need to put all the options back in.	
    if (refill == "yes") {
        for (i = 0; i < buildingdata.length - 1; i++) {
            secondarybuildingdata.push({
                value: "" + buildingdata[i][1] + "",
                label: "" + buildingdata[i][2] + " - " + buildingdata[i][1] + ""
            });

        }
    }


    //Usually this will just be being told to update the array based upon the verified campus code. So run through and find the relevant buildings.		
    else {
        for (i = 0; i < buildingdata.length - 1; i++) {
            if (buildingdata[i][0] == verifiedcampuscode) {
                secondarybuildingdata.push({
                    value: "" + buildingdata[i][1] + "",
                    label: "" + buildingdata[i][2] + " - " + buildingdata[i][1] + ""
                });
            }
        }
    }


    //Alphabetise it!
    secondarybuildingdata.sort(function (a, b) {
        var textA = a.label.toUpperCase();
        var textB = b.label.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

}


function roomautocomplete(val) {
    namedroomsautocomplete.length = 0;
    var tbbuildingval = $(tbBuilding).val().toUpperCase();

    if (val) {
        var tbbuildingval = val;
    }
    for (i = 0; i < namedrooms.length - 1; i++) {
        if (namedrooms[i][1] == tbbuildingval) {
            namedroomsautocomplete.push({
                value: "" + namedrooms[i][2] + "",
                label: "" + namedrooms[i][0] + " - " + namedrooms[i][2] + ""
            });
        }
    }
    //Alphabetise it!
    namedroomsautocomplete.sort(function (a, b) {
        var textA = a.label.toUpperCase();
        var textB = b.label.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

}




function decoderoomcode(skip) {
    $(divPrompt).hide();
    $(aInferCampus).hide();
    var buildingcampusmatch = "";
    var inferredcampus = "";
    var usrroomcode = $(tbRoom).val().toUpperCase();
    var roomclue = "";
    //Check building is at campus
    //If yes
    //pull out relevant info from master array
    //update the roomfinder layer query
    verifybuildingcode();
    verifycampuscode();

    if (buildingexists == "true") {

        changequery('decode-button', verifiedbuildingcode, roomfinderlayer);

        //Does the verified building code match the verified campus code?
        buildingcampusmatch = "false";



        //Course of action to take if campus code is blank
        //inferring the campus
        if (usrcampuscode == "") {
            if (skip != 'infercampusblock') {
                for (i = 0; i < buildingdata.length; i++) {
                    if (buildingdata[i][1] == verifiedbuildingcode) {

                        inferredcampus = buildingdata[i][0];
                        $('#tb-campus').val(inferredcampus);
                        movemap('', inferredcampus);
                        buildtransportlink();
                        decoderoomcode('infercampusblock');
                        return;
                    }
                }
            }
        }


        //Course of action to take if user has entered a campus code
        else {

            for (i = 0; i < buildingdata.length; i++) {

                if (buildingdata[i][1] == verifiedbuildingcode) {

                    //If campus and building match
                    if (buildingdata[i][0] == verifiedcampuscode) {
                        buildingcampusmatch = "true";
                        $(divPrompt).hide();
                        $("div.plaintext").show();
                        $('span.plaintext').text(plainspeakbuilding);
                        $('span.plaintextcampus').text(plainspeakcampus);
                        $("a#campusmap[href]").attr('href', campusmapurl);
                        $("a#campusmap").button("enable");
                        $("span#addr1").text(plainspeakbuilding);
                        $("span#addr2").text("Leeds Metropolitan University");
                        $("span#addr3").text(plainspeakcampus);

                        if (addressextra != "") {
                            $("span#addr4").text(addressextra);
                        }

                        $("span#addr-postcode").text(destpostcode);
                        movemap('', verifiedcampuscode);
                        buildtransportlink();
                    }
                    //If campus and building don't match
                    else if (buildingdata[i][1] != verifiedcampuscode) {
                        movemap('', 'null');
                        $(divPrompt).show();
                        $("div.plaintext").hide();
                        $('span.plaintext').text("");


                        //Probably want to use different phrasing if the campus is just a mismatch, or doesn't even exist

                        if (campusexists == "true") {
                            $('span#prompttext').text(plainspeakbuilding + " is not located at " + plainspeakcampus + "");

                        } else if (campusexists == "false") {
                            $('span#prompttext').text(plainspeakbuilding + " is not located at the campus you entered");
                        }

                        $(aInferCampus).css('display', 'block').attr('onclick', 'campusinfer()');

                    }
                }
            }
        }


        //only worth handling roomnumbers if the building exists, so this is inside the Building Exists loop.
        if (usrroomcode) {
            roomclue = usrroomcode.charAt(0);

            for (i = 0; i < namedrooms.length; i++) {

                if (namedrooms[i][2] == usrroomcode) {

                    if (namedrooms[i][1] == verifiedbuildingcode) {
                        $('span.plaintextroom').text(namedrooms[i][0]);
                    } else {
                        $('span.plaintextroom').text(namedrooms[i][0] + " is not in " + plainspeakbuilding).css('font-size', '0.9em');
                    }

                }
            }


            if (roomclue == "G") {
                $('span.plaintextroom').text(usrroomcode + " (Ground Floor)");
            } else if (roomclue == "1") {
                $('span.plaintextroom').text(usrroomcode + " (First Floor)");
            } else if (roomclue == "2") {
                $('span.plaintextroom').text(usrroomcode + " (Second Floor)");
            } else if (roomclue == "3") {
                $('span.plaintextroom').text(usrroomcode + " (Third Floor)");
            } else if (roomclue == "4") {
                $('span.plaintextroom').text(usrroomcode + " (Fourth Floor)");
            } else if (roomclue == "5") {
                $('span.plaintextroom').text(usrroomcode + " (Fifth Floor)");
            } else if (roomclue == "6") {
                $('span.plaintextroom').text(usrroomcode + " (Sixth Floor)");
            } else if (roomclue == "7") {
                $('span.plaintextroom').text(usrroomcode + " (Seventh Floor)");
            } else if (roomclue == "8") {
                $('span.plaintextroom').text(usrroomcode + " (Eighth Floor)");
            }

        } else {
            $('span.plaintextroom').text("");
            roomclue = "";
        }


    } else {
        $("div.plaintext").hide();
        $(divPrompt).show();
        movemap('', verifiedcampuscode);
    } //Building doesn't exist

}

function campusinfer() {

    for (i = 0; i < buildingdata.length - 1; i++) {

        if (buildingdata[i][1] === verifiedbuildingcode) {

            inferredcampus = buildingdata[i][0];

            $(tbCampus).val(inferredcampus);

            //verifycampuscode('',inferredcampus);

            decoderoomcode('infercampusblock');

        }
    }

}


function buildtransportlink() {
    $(btnTransport).button("enable");
    var transporturlbase = "https://maps.google.com/maps?";
    var usrpostcode = $(tbUsrPostcode).val();
    var carurl = "";
    var walkingurl = "";
    var publictransporturl = "";

    //usr postcode isn't empty...
    if (usrpostcode != "") {
        carurl = transporturlbase + "saddr=" + usrpostcode + "&daddr=" + destpostcode;
        walkingurl = transporturlbase + "saddr=" + usrpostcode + "&daddr=" + destpostcode + "&dirflg=w";
        publictransporturl = transporturlbase + "saddr=" + usrpostcode + "&daddr=" + destpostcode + "&dirflg=r";
    }

    //usr hasn't entered a postcode...
    else {
        carurl = transporturlbase + "daddr=" + destpostcode;
        walkingurl = transporturlbase + "daddr=" + destpostcode + "&dirflg=w";
        publictransporturl = transporturlbase + "daddr=" + destpostcode + "&dirflg=r";
    }

    $("a#carlink[href]").attr('href', carurl)
    $("a#walklink[href]").attr('href', walkingurl)
    $("a#publictransportlink[href]").attr('href', publictransporturl)

}







function initializeCampusNav(version) {
    var mapversion = version;

    if (mapversion === 'mobile') {
        initializeMobile();
    } else if (mapversion === 'desktop') {
        initializeDesktop();
    }
}




function initializeCampusNavWidget() {

    //NB - The --wid suffix is to denote HTML elements in the Widget.

    var tbSearchbar = "#searchbar--wid";
    var tbCampus = "#tb-campus--wid";
    var tbBuilding = "#tb-building--wid";
    var tbRoom = "#tb-room--wid";


    //Prebuild Autocompletes
    //Building Box
    for (i = 0; i < buildingdata.length - 1; i++) {
        autobuild.push({
            value: "" + buildingdata[i][1] + "",
            label: "" + buildingdata[i][2] + " - " + buildingdata[i][1] + ""
        });
        secondarybuildingdata.push({
            value: "" + buildingdata[i][1] + "",
            label: "" + buildingdata[i][2] + " - " + buildingdata[i][1] + ""
        });

        //Alphabetise it by building name
        secondarybuildingdata.sort(function (a, b) {
            var textA = a.label.toUpperCase();
            var textB = b.label.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    //CampusBox
    for (i = 0; i < campuscodes.length; i++) {
        autocampus.push({
            value: "" + campuscodes[i][0] + "",
            label: "" + campuscodes[i][1] + " - " + campuscodes[i][0] + ""
        });
    }

    //Searchbar
    for (i = 0; i < searchdata.length - 1; i++) {
        autosearchbuild.push({
            value: "" + searchdata[i][0] + "",
            label: "" + searchdata[i][0] + ""
        });
    }


    $(tbSearchbar).autocomplete({
        source: autosearchbuild,
        minLength: 0
    }).bind('focus', function () {
        $(this).autocomplete("search");
    });



    $(tbCampus).keyup(function () {
        //verifycampuscode("campuskeyup");
        nextbox(this, tbBuilding, 1);
    });


    $(tbCampus).autocomplete({
        source: autocampus,
        select: function (e, ui) {
            verifycampuscode("campuskeyup", ui.item.value);
            nextbox(this, tbBuilding, "");
        },
        minLength: 0
    }).bind('focus', function () {
        $(this).autocomplete("search");

    });


    $(tbBuilding).autocomplete({
        source: secondarybuildingdata,
        select: function (e, ui) {
            roomautocomplete(ui.item.value);
            nextbox(this, "tb-room", "");
        },
        minLength: 0
    }).bind('focus', function () {
        $(this).autocomplete("search");
    }).bind('focus', function () {
        $(this).tooltip("close");
    }).bind('focus', function () {
        verifycampuscode("campuskeyup");
    });

    $(tbBuilding).keyup(function (event) {
        roomautocomplete();

        if (event.keyCode == 13) {
            decoderoomcode();
            $(tbBuilding).autocomplete("close");
        }
    });

    $(tbRoom).keyup(function (event) {
        if (event.keyCode == 13) {
            decoderoomcode();
        }
    });

    $(tbRoom).autocomplete({
        source: namedroomsautocomplete

    }).bind('focus', function () {
        $(this).autocomplete("search");
    });


    $(tbSearchbar).keyup(function (event) {
        if (event.keyCode == 13) {
            changequery('searchsubmit', 'x', adhoclayer);
            $(tbSearchbar).autocomplete("close");
        }
    });


}
