/**
 * This file is part of Threema Web.
 *
 * Threema Web is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Threema Web. If not, see <http://www.gnu.org/licenses/>.
 */

import {MediaboxService} from '../services/mediabox';

export default [
    '$rootScope',
    '$filter',
    '$document',
    'MediaboxService',
    function($rootScope: ng.IRootScopeService,
             $filter: ng.IFilterService,
             $document: ng.IDocumentService,
             mediaboxService: MediaboxService) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {},
            controllerAs: 'ctrl',
            controller: [function() {
                // Data attributes
                this.imageDataUrl = null;
                this.caption = '';

                // Close method
                this.close = () => {
                    this.imageDataUrl = null;
                };

                // Listen to Mediabox service events
                const filter = $filter('bufferToUrl') as (buffer: ArrayBuffer, mimeType: string) => string;
                mediaboxService.evtMediaChanged.attach((dataAvailable: boolean) => {
                    $rootScope.$apply(() => {
                        this.imageDataUrl = filter(mediaboxService.data, 'image/jpeg');
                        this.caption = mediaboxService.caption;
                    });
                });
            }],
            link($scope: any, $element: ng.IAugmentedJQuery, attrs) {
                // Register event handler for ESC key
                $document.on('keyup', (e: Event) => {
                    const ke = e as KeyboardEvent;
                    if (ke.key === 'Escape' && $scope.ctrl.imageDataUrl !== null) {
                        $scope.$apply($scope.ctrl.close);
                    }
                });
            },
            // tslint:disable:max-line-length
            template: `
                <div class="box" ng-if="ctrl.imageDataUrl !== null">
                    <md-icon class="close material-icons md-24" ng-click="ctrl.close()" aria-label="Close" translate-attr="{'aria-label': 'common.CLOSE'}">close</md-icon>
                    <div class="inner">
                        <img ng-src="{{ ctrl.imageDataUrl }}">
                        <div class="caption">
                            {{ ctrl.caption }}
                        </div>
                    </div>
                </div>
            `,
        };
    },
];
