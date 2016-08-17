(function() {

    'use strict';

    var Doorway = require('./doorway');
    var $header = $('[data-doorway-header]');
    var deadzone = $header.attr('data-doorway-deadzone');

    Doorway($header, {
        offset: deadzone,
        onPin: function(){
            $header.trigger('is-pinned');
        },
        onUnpin: function(){
            $header.trigger('is-unpinned');
        }
    });

})();
