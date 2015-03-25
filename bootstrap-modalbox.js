/* ===========================================================
 * bootstrap-modalbox.js v0.2
 * ===========================================================
 * Copyright 2015 José Carlos Chávez <jcchavezs@gmail.com>
 * ========================================================== */
;
(function($) {
    $.fn.modalmanager.defaults.resize = true;

    $.fn.extend({
        modalbox: function(settings) {
            this.each(function(i, e) {
                $(e).on('click', function(evt) {
                    evt.preventDefault();
                    $.modalbox(settings, e);
                    return false;
                });
            });

            return;
        }
    });

    $.modalbox = function(settings, e) {
        settings = $.extend({}, $.modalbox.defaults, settings);

        var $mb;

        if (!settings.hasOwnProperty('title') && typeof (e) !== undefined) {
            settings.title = e.title;
        }

        if (!settings.hasOwnProperty('source') && typeof (e) !== undefined) {
            settings.source = e.href;
        }

        if ($('#' + settings.id).length === 0) {
            $mb = $('<div />', {
                'id': settings.id,
                'class': 'modal fade modalbox-' + settings.type,
                'tabindex': -1
            });

            if(settings.hasOwnProperty('dataWidth')) {
                $mb.attr('data-width', settings.dataWidth);
            }

            $('body', settings.target).append($mb);

            $mb.prepend('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 class="modal-title">' + (settings.title ? settings.title : '&nbsp;') + '</h3></div>');

            $mb.append('<div class="modal-body"></div>');
        } else {
            $mb = $('#' + settings.id, settings.target);

            if (settings.cache) {
                $mb.find('.modal-header h3').html(settings.title);
                $mb.find('.modal-body').empty();
                $mb.find('.modal-footer').remove();
            }
        }

        if (settings.hasOwnProperty('beforeShow')) {
            $.modalbox.callback(settings.beforeShow, $mb.get(0), [settings]);
        }

        switch (settings.type) {
            case 'ajax':
                $('body').modalmanager('loading');

                $mb.find('.modal-body').load(settings.source, function() {
                    $mb.modal(settings);

                    if (settings.hasOwnProperty('afterShow')) {
                        $.modalbox.callback(settings.afterShow, $mb.get(0), [settings]);
                    }
                });

                break;
            case 'iframe':
                var $iframe;

                if ($('iframe#' + settings.id + '-iframe').length === 0) {
                    $iframe = $('<iframe />', {
                        'name': settings.id + '-iframe',
                        'src': settings.source,
                        'height': '100%',
                        'width': '100%',
                        'frameborder': 0
                    });

                    $mb.find('.modal-body').append($iframe);
                } else {
                    $iframe = $('iframe#' + settings.id + '-iframe');
                }

                $mb.modal(settings);

                var iframe = $iframe.get(0);

                if (settings.hasOwnProperty('afterShow')) {
                    if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
                        iframe.onreadystatechange = function() {
                            if (iframe.readyState === "complete") {
                                $.modalbox.callback(settings.afterShow, $mb.get(0), [settings]);
                            }
                        };
                    } else {
                        iframe.onload = function() {
                            $.modalbox.callback(settings.afterShow, $mb.get(0), [settings]);
                        };
                    }
                }

                break;
            case 'html':
                $mb.modal(settings);

                $mb.find('.modal-body').html(settings.source);

                if (settings.hasOwnProperty('afterShow')) {
                    $.modalbox.callback(settings.afterShow, $mb.get(0), [settings]);

                }
                break;
            case 'inline':
                $mb.modal(settings);

                $mb.find('.modal-body').append($(settings.source)./*clone().*/attr('id', settings.id + settings.source.replace('#', '-')));

                if (settings.hasOwnProperty('afterShow')) {
                    $.modalbox.callback(settings.afterShow, $mb.get(0), [settings]);
                }

                break;
        }

        if (settings.buttons && settings.buttons.length > 0) {
            $mb.append('<div class="modal-footer"></div>');

            $.each(settings.buttons, function(i, b) {
                if (typeof b === 'string') {
                    switch (b) {
                        case 'ok':
                        case 'yes':
                            b = {
                                'type': 'button',
                                'class': 'btn btn-primary',
                                'text': $.modalbox.locale[b]
                            };
                            break;
                        case 'cancel':
                        case 'no':
                            b = {
                                'type': 'button',
                                'class': 'btn',
                                'text': $.modalbox.locale[b],
                                'data-dismiss': 'modal'
                            };
                            break;
                        case 'close':
                            b = {
                                'type': 'button',
                                'class': 'btn',
                                'text': $.modalbox.locale[b],
                                'data-dismiss': 'modal'
                            };
                            break;
                        case 'save':
                        case 'submit':
                            b = {
                                'type': 'button',
                                'class': 'btn btn-primary',
                                'text': settings.buttonSubmitLabel ? settings.buttonSubmitLabel : $.modalbox.locale[b],
                                'on': {
                                    'click': function() {
                                        switch (settings.type) {
                                            case 'iframe':
                                                $iframe.contents().find('form:first').submit();
                                                break;
                                            default:
                                                $mb.find('.modal-body form:first').submit();
                                                break;
                                        }
                                    }
                                }
                            };
                            break;
                    }
                }

                $mb.find('.modal-footer').append($('<button />', b));
            });
        }

        if (settings.hasOwnProperty('afterClose')) {
            $mb.on('hidden', function() {
                $.modalbox.callback(settings.afterClose, $mb.get(0), [settings]);
            });
        }

        $mb.modal('show');
    };

    $.modalbox.uniqid = function() {
        return parseInt(Math.random() * 1000000);
    };

    $.modalbox.callback = function(callback, thisArg, arguments) {
        switch (typeof callback) {
            case 'function':
                return callback.apply(thisArg, arguments);
                break;
            case 'string':
                return window[callback].apply(thisArg, arguments);
                break;
        }
    };

    $.modalbox.defaults = {
        'id': 'modalbox-' + $.modalbox.uniqid(),
        'resize': true,
        'target': window.document,
        'type': 'inline',
        'buttonSubmitLabel': false,
        'cache': true
    };

    $.modalbox.locale = {
        yes: 'Yes',
        no: 'No',
        ok: 'Ok',
        cancel: 'Cancel',
        close: 'Close',
        submit: 'Submit',
        save: 'Save'
    };

    $.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner =
            '<div class="loading-spinner" style="width: 200px; margin-left: -100px;">' +
            '<div class="progress progress-striped active">' +
            '<div class="progress-bar" style="width: 100%;"></div>' +
            '</div>' +
            '</div>';

    $(document).ready(function() {
        $('[data-toggle=modalbox]').each(function(i, e) {
            var settings = jQuery.parseJSON($(e).attr('data-modalbox-settings'));
            $(e).modalbox(settings);
        });
    });

})(jQuery);