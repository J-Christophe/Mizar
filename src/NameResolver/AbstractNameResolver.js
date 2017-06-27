/*******************************************************************************
 * Copyright 2017 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
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
define([],
    function () {

        /**************************************************************************************************************/

        /**
         * @name AbstractNameResolverer
         * @class
         * Abstract Wrapper constructor
         * @param {Context} options - Context
         * @constructor
         * @implements {NameResolver}
         */
        var AbstractNameResolver = function (options) {
            this.ctx = options;
        };

        /**************************************************************************************************************/

        /**
         * @function handle
         * @memberOf AbstractNameResolver#
         * @abstract
         */
        AbstractNameResolver.prototype.handle = function (options) {
            throw "handle from NameResolver not implemented";
        };

        /**
         * @function remove
         * @memberOf AbstractNameResolver#
         * @abstract
         */
        AbstractNameResolver.prototype.remove = function () {
            throw "remove from NameResolver not implemented";
        };        

        /**************************************************************************************************************/

        return AbstractNameResolver;
    });
