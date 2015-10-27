/*DEPENDENCIES */
/*libraries*/
var $ = require('../../bower_components/jquery/dist/jquery'),
    _ = require('../../bower_components/lodash/lodash'),
    IScroll = require('../../bower_components/iscroll/build/iscroll.js');

/*service*/
var service = require('./trueService');

/*template*/
var testTamplate = $('#test').html();
/*DEPENDENCIES */

$(document).ready(function () {

    var tmpl = $('#module').html(),
        verticalScroll,
        horisonatlScroll;


    var holders = {
        "render"           : "#render",
        "root"             : ".pa-color-array",
        "filterItemWrapper": ".pa-color-array_filter_item_wrapper",
        "filterItem"       : '.pa-color-array_filter_item',
        "filterItemBorder" : '.pa-color-array_filter_item_border',
        "collorArrayFilter": ".pa-color-array_filter",
        "palleteItem"      : '.pa-color-array_pallete'
    };

    var holdersClass = {
        "filterItemBorderHide": 'pa-color-array_filter_item_border__hide',
        "showPallete": "show-pallete"

    };


    function initialize() {
        render();
        events();
        setFirstTabState(0);
        setFilterWrapperWidth();
        initHorizontalScroll();
        initVerticalScroll();
    }

    initialize();

    function render() {
     var filteredJson = ParserJson(service),
         orderJsonPallete = orderPalletesCollors(filteredJson),
         template = _.template(tmpl),
         view = template(orderJsonPallete);

        $(holders.render).append(view);
    }


    function ParserJson(json) {
        var groupColors = [],
            allId = _.pluck(json.colours, 'family'),
            uniqueId = _.uniq(allId);

        _.each(uniqueId, function (curID) {

            var obj = {};
            obj.id = curID;
            obj.filterTitle = null;
            obj.nameEn = null;
            obj.nameFr = null;
            obj.filterColor = null;
            obj.filterPallete = [];


            _.each(json.colours, function (oneElem) {
                if (curID == oneElem.family) {
                    obj.family = oneElem.family;
                    var color = "rgb(" + oneElem.red + "," + oneElem.green + "," + oneElem.blue + ")";
                    obj.filterPallete.push(color);
                }
            });

            _.each(json.coloursFamilies, function (oneElem) {
                if (curID == oneElem.nodeName) {
                    obj.nameEn = oneElem.titleEn;
                    obj.nameFr = oneElem.titleFr;
                    obj.filterColor = "rgb(" + oneElem.red + "," + oneElem.green + "," + oneElem.blue + ")";
                }
            });

            groupColors.push(obj);
        });

        return groupColors;
    }

    function orderPalletesCollors(json) {
        var orderData = json;

        function sumColor(str) {
            var rgb = str.replace(/[()]/g, "").split(",").map(Number);

            // Summing the channels does not calculate brightness, so this is incorrect:
            // return rgb[0] + rgb[1] + rgb[2];

            // To calculate relative luminance under sRGB and RGB colorspaces that use Rec. 709:
            return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
        }

        function comparePallete(a, b) {
            var regExp = /rgb\((\d*),(\d*),(\d*)\)/;
            var first = a.match(regExp).slice(1);
            var second = b.match(regExp).slice(1);

            var a = 0.2126 * first[0] + 0.7152 * first[1] + 0.0722 * first[2];
            var b = 0.2126 * second[0] + 0.7152 * second[1] + 0.0722 * second[2];

            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        }

        orderData.forEach(function (item) {
            item.filterPallete = item.filterPallete.sort(comparePallete);
        });

        console.log(orderData);
        return orderData;
    }

    function events() {
        $(holders.filterItemWrapper).click(selectFilterItem);
        $(window).resize(setFilterWrapperWidth);
    }

    function setFirstTabState(index) {
        $(holders.root).each(function (i, item) {
            var curState = $(item).attr("state-position");

            var filterItem = $(holders.filterItem).eq(curState);
            filterItem.find(holders.filterItemBorder).removeClass(holdersClass.filterItemBorderHide);

            var palleteItem = $(holders.palleteItem).eq(curState);
            palleteItem.addClass(holdersClass.showPallete);

            initVerticalScroll();
        });

    }

    function selectFilterItem(e) {
        var current = e.currentTarget;
        var filterId = $(current).attr("data-link");

        $(holders.filterItemBorder).addClass(holdersClass.filterItemBorderHide);
        $(current).find(holders.filterItemBorder).removeClass(holdersClass.filterItemBorderHide);
        $(holders.palleteItem).removeClass(holdersClass.showPallete);


        $(holders.palleteItem).each(function (i, item) {
            var palleteId = $(item).attr("id");
            if (filterId == palleteId) {
                $(holders.palleteItem).removeClass(holdersClass.showPallete);
                $(item).addClass(holdersClass.showPallete)
            }
        });

        refreshVericalScroll();
    }

    function setFilterWrapperWidth() {
        var generalFilterItemWidth = 0;

        $(holders.filterItemWrapper).each(function (i, item) {
            var itemWidth = $(item).outerWidth();
            generalFilterItemWidth += itemWidth
        });

        $(holders.collorArrayFilter).width(generalFilterItemWidth)
    }

    function initHorizontalScroll() {
        var el = $(".pa-color-array_filter_wrapper").get(0);
        horisonatlScroll = new IScroll(el, {
            mouseWheel: true,
            scrollbars: false,
            scrollX: true,
            scrollY: false,
            click: false,
            preventDefaultException: {
                tagName: /.*/
            }
        });
    }

    function refreshHorizontalScroll() {
        horisonatlScroll.refresh();
    }

    function initVerticalScroll() {
        var el = $(".pa-color-array_palletes_wrapper").get(0);
        verticalScroll = new IScroll(el, {
            mouseWheel: true,
            scrollbars: false,
            scrollX: false,
            scrollY: true,
            click: false,
            preventDefaultException: {
                tagName: /.*/
            }
        });
    }

    function refreshVericalScroll() {
        verticalScroll.refresh();
    }
});