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
 *    Layer service view
 *    The view representing the services for each layer
 */
define(["jquery", "service/gui/OpenSearchService", "../service/gui/MocService", "../service/gui/XMatchService", "uws/HEALPixCutService", "jquery.ui"],
    function ($, OpenSearchService, MocService, XMatchService, HEALPixCutService) {

        var layerServiceView = '<div id="layerServiceView" title="Available services">\
							<div id="layerServices">\
								<ul>\
								</ul>\
							</div>\
						</div>';

// jQuery selectors
        var $layerServiceView;
        var tabs;

        var services = [OpenSearchService, MocService, XMatchService];

        var serviceMapping = {
            "OpenSearch": OpenSearchService,
            "Moc": MocService,
            "XMatch": XMatchService,
            "HEALPixCut": HEALPixCutService
        };

        var currentLayer;

        /**
         *    Get service object from configuration
         *    (could be string or object)
         */
        function getServiceFromConf(service) {
            if (typeof service === "string") {
                return serviceMapping[service];
            }
            else {
                if (service.name) {
                    return serviceMapping[service.name];
                }
                else {
                    console.error("Service must have name property in configuration");
                    return null;
                }
            }
        }

        return {
            /**
             *    Initilize layer service view
             */
            init: function (mizar, configuration) {
                // Create jQuery UI dialog to represent layer service view
                $layerServiceView = $(layerServiceView)
                    .appendTo('body')
                    .dialog({
                        autoOpen: false,
                        resizable: false,
                        width: '600px',
                        show: {
                            effect: "fade",
                            duration: 300
                        },
                        hide: {
                            effect: "fade",
                            duration: 300
                        },
                        minHeight: 'auto',
                        position: ['middle', 20],
                        open: function () {
                            // Remove auto-focus
                            $(this).find('li:first-child').blur();
                        }
                    });

                tabs = $layerServiceView.find('#layerServices').tabs({
                    collapsible: true,
                    hide: {effect: "slideUp", duration: 300},
                    show: {effect: "slideDown", duration: 300}
                });
                OpenSearchService.init(mizar);
                MocService.init(mizar);
                XMatchService.init(mizar, configuration);
                HEALPixCutService.init(mizar);
            },

            /**
             *    Remove created dialog
             */
            remove: function () {
                $layerServiceView.find('#layerServices').tabs("destroy");
                $layerServiceView.dialog("destroy").remove();
            },

            show: function (layer) {
                var service;
                // Remove previous services
                if (currentLayer) {
                    Object.keys(currentLayer.getServices()).forEach(function (key) {
                        service = getServiceFromConf(key);
                        if (service.removeLayer)
                            service.removeLayer(currentLayer);
                        service.removeService(tabs, key);
                    });
                }
                Object.keys(layer.getServices()).forEach(function (key) {
                    service = getServiceFromConf(key);
                    if (service) {
                        if (service.addLayer) {
                            service.addLayer(layer);
                        }
                        service.addService(tabs, key);
                        console.log("service added");
                    } else {
                        // Unrecognized service, remove it
                        console.error("Mapping doesn't exist, service must be = { OpenSearch, Moc, XMatch or HEALPixCut }");
                        delete layer.getServices()[key];
                    }
                });
                currentLayer = layer;

                tabs.tabs('refresh');
                tabs.tabs("option", "active", 0);

                $layerServiceView.dialog("open");
            }
        }

    });
