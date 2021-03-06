/*******************************************************************************
 * Copyright 2012-2015 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 *
 * This file is part of MIZAR.
 *
 * MIZAR is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MIZAR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MIZAR. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
/*global define: false */

/**
 *    ImageProcessing module
 */
define(["jquery", "./CutOutViewFactory", "./DynamicImageView", "jquery.ui"],
    function ($, CutOutViewFactory, DynamicImageView) {

        /**************************************************************************************************************/

        var unselect;
        var cutOutElement;
        var mizarWidgetAPI;

        /**************************************************************************************************************/

        /**
         *    Remove view
         */
        function remove() {
            CutOutViewFactory.removeView(cutOutElement);
        }

        /**************************************************************************************************************/

        return {

            /**
             *    Init ImageProcessing
             *
             *    @param options
             *        <ul>
             *            <li>unselect: Unselect callback</li>
             *        </ul>
             */
            init: function (options) {
                if (options) {
                    mizarWidgetAPI = options.mizar;
                    //this.id = options.id;

                    // Callbacks
                    unselect = options.unselect || null;
                }

                var dialog =
                    '<div>\
                        <div class="imageProcessing" id="imageProcessing" title="Image processing">\
                            <h3>Histogram</h3>\
                            <div class="histogramContent">\
                                <p> Fits isn\'t loaded, thus histogram information isn\'t available</p>\
                                <div style="display: none;" id="histogramView"></div>\
                            </div>\
                            <h3>Cutout</h3>\
                            <div id="cutOutView"></div>\
                        </div>\
                    </div>';

                var $dialog = $(dialog).appendTo('body').dialog({
                    title: 'Image processing',
                    autoOpen: false,
                    show: {
                        effect: "fade",
                        duration: 300
                    },
                    hide: {
                        effect: "fade",
                        duration: 300
                    },
                    width: 500,
                    resizable: false,
                    minHeight: 'auto',
                    close: function (event, ui) {
                        if (unselect) {
                            unselect();
                        }

                        $(this).dialog("close");

                    }
                }).find(".imageProcessing").accordion({
                    autoHeight: false,
                    active: 0,
                    collapsible: true,
                    heightStyle: "content"
                }).end();

                var histogramElement = new DynamicImageView("histogramView", {
                    id: "featureImageProcessing",
                    mizar : mizarWidgetAPI,
                    changeShaderCallback: mizarWidgetAPI.getMizarAPI().ServiceFactory.create(mizarWidgetAPI.SERVICE.ImageProcessing).changeShaderCallback
                });
                cutOutElement = CutOutViewFactory.addView("cutOutView");

                mizarWidgetAPI.getServiceByName(mizarWidgetAPI.SERVICE.ImageProcessing).init(options, $dialog, histogramElement, cutOutElement);

                mizarWidgetAPI.subscribeCtx("image:set", mizarWidgetAPI.getServiceByName(mizarWidgetAPI.SERVICE.ImageProcessing).setImage);
            }
        };
    });
