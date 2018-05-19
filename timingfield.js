function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}
$(function() {
    var TimingField = function(element, options) {
        this.elem = $(element);
        this.disabled = false;
        this.settings = $.extend({}, $.fn.timingfield.defaults, options);
        this.tpl = $($.fn.timingfield.template);

        this.init();
    };

    TimingField.prototype = {
        init: function() {
            this.elem.after(this.tpl);
            this.elem.hide();
            var timeoutId = 0;

            if (this.elem.is(':disabled')) {
                this.disable();
            }
			
			if (this.elem.val().length <= 0) {
				if (this.settings.value > 86399)
					this.settings.value = 86399;
				
				this.elem.val(this.settings.value);
			}

            this.getHours().value = this.tsToHours(this.elem.val());
            this.getMinutes().value = this.tsToMinutes(this.elem.val());
            this.getSeconds().value = this.tsToSeconds(this.elem.val());

            this.tpl.width(this.settings.width);
            this.tpl.find('.timingfield_hours   .input-group-addon').text(this.settings.hoursText);
            this.tpl.find('.timingfield_minutes .input-group-addon').text(this.settings.minutesText);
            this.tpl.find('.timingfield_seconds .input-group-addon').text(this.settings.secondsText);

            // +/- triggers
            var upHour = $.proxy(this.upHour, this); // `this` is plugin instace 
            this.tpl.find('.timingfield_hours .timingfield_next')
                .on('mouseup touchend', function() {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown touchstart', function(e) {
                    timeoutId = setInterval(upHour, 100);
                    return false;
                });

            var downHour = $.proxy(this.downHour, this); // `this` is plugin instace 
            this.tpl.find('.timingfield_hours .timingfield_prev')
                .on('mouseup touchend', function() {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown touchstart', function(e) {
                    timeoutId = setInterval(downHour, 100);
                    return false;
                });

            var upMin = $.proxy(this.upMin, this); // `this` is plugin instace 
            this.tpl.find('.timingfield_minutes .timingfield_next')
                .on('mouseup touchend', function() {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown touchstart', function(e) {
                    timeoutId = setInterval(upMin, 100);
                    return false;
                });

            var downMin = $.proxy(this.downMin, this); // `this` is plugin instace 
            this.tpl.find('.timingfield_minutes .timingfield_prev')
                .on('mouseup touchend', function() {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown touchstart', function(e) {
                    timeoutId = setInterval(downMin, 100);
                    return false;
                });

            var upSec = $.proxy(this.upSec, this); // `this` is plugin instace 
            this.tpl.find('.timingfield_seconds .timingfield_next')
                .on('mouseup touchend', function() {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown touchstart', function(e) {
                    timeoutId = setInterval(upSec, 100);
                    return false;
                });

            var downSec = $.proxy(this.downSec, this); // `this` is plugin instace 
            this.tpl.find('.timingfield_seconds .timingfield_prev')
                .on('mouseup touchend', function() {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown touchstart', function(e) {
                    timeoutId = setInterval(downSec, 100);
                    return false;
                });

            // input triggers
            this.tpl.find('.timingfield_hours   input').on('keyup', $.proxy(this.inputHour, this));
            this.tpl.find('.timingfield_minutes input').on('keyup', $.proxy(this.inputMin, this));
            this.tpl.find('.timingfield_seconds input').on('keyup', $.proxy(this.inputSec, this));

            // change on elem
            this.elem.on('change', $.proxy(this.change, this));

            $("input:text").keydown(function(e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl/cmd+A
                    (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: Ctrl/cmd+C
                    (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: Ctrl/cmd+X
                    (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        },
        getHours: function() {
            return this.tpl.find('.timingfield_hours input')[0];
        },
        getMinutes: function() {
            return this.tpl.find('.timingfield_minutes input')[0];
        },
        getSeconds: function() {
            return this.tpl.find('.timingfield_seconds input')[0];
        },
        tsToHours: function(timestamp) {
            return parseInt(timestamp / 3600);
        },
        tsToMinutes: function(timestamp) {
            return parseInt((timestamp % 3600) / 60);
        },
        tsToSeconds: function(timestamp) {
            return parseInt((timestamp % 3600) % 60);
        },
        hmsToTimestamp: function(h, m, s) {
            return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
        },
        updateElem: function() {
            this.elem.val(this.hmsToTimestamp(
                this.getHours().value,
                this.getMinutes().value,
                this.getSeconds().value
            )).trigger("change");
        },
        upHour: function() {
            if (!this.disabled) {
                if (this.getHours().value < 23) {
                    this.getHours().value = parseInt(this.getHours().value) + 1;
                    this.updateElem();
                    return true;
                }
            }
            return false;
        },
        downHour: function() {
            if (!this.disabled) {
                if (this.getHours().value > 0) {
                    this.getHours().value = parseInt(this.getHours().value) - 1;
                    this.updateElem();
                    return true;
                }
            }
            return false;
        },
        inputHour: function() {
            if (!this.disabled) {
                if (this.getHours().value < 0) {
                    this.getHours().value = 0;
                } else if (this.getHours().value > 23) {
                    this.getHours().value = 23;
                }
            }

            this.updateElem();
        },
        upMin: function() {
            if (!this.disabled) {
                if (this.getMinutes().value < 59) {
                    this.getMinutes().value = parseInt(this.getMinutes().value) + this.settings.minutesInterval;
                    if (this.getMinutes().value > 59 && this.upHour()) {
                        this.getMinutes().value = 0;
                        this.updateElem();
                        return true;
                    } else {
						if (this.getMinutes().value > 59)
							this.getMinutes().value = 59;
                        this.updateElem();
                        return true;
                    }
                } else if (this.upHour()) {
                    this.getMinutes().value = 0;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        downMin: function() {
            if (!this.disabled) {
                if (this.getMinutes().value > 0) {
                    this.getMinutes().value = parseInt(this.getMinutes().value) - this.settings.minutesInterval;
                    this.updateElem();
                    return true;
                } else if (this.downHour()) {
                    this.getMinutes().value = 60 - this.settings.minutesInterval;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        inputMin: function() {
            if (!this.disabled) {
                if (this.getMinutes().value < 0) {
                    this.getMinutes().value = 0;
                } else if (this.getMinutes().value > 59) {
                    this.getMinutes().value = 59;
                }

                this.updateElem();
            }
        },
        upSec: function() {
            if (!this.disabled) {
                if (this.getSeconds().value < 59) {
                    this.getSeconds().value = parseInt(this.getSeconds().value) + 1;
                    this.updateElem();
                    return true;
                } else if (this.upMin()) {
                    this.getSeconds().value = 0;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        downSec: function() {
            if (!this.disabled) {
                if (this.getSeconds().value > 0) {
                    this.getSeconds().value = parseInt(this.getSeconds().value) - 1;
                    this.updateElem();
                    return true;
                } else if (this.downMin()) {
                    this.getSeconds().value = 59;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        inputSec: function() {
            if (!this.disabled) {
                if (this.getSeconds().value < 0) {
                    this.getSeconds().value = 0;
                } else if (this.getSeconds().value > 59) {
                    this.getSeconds().value = 59;
                }

                this.updateElem();
            }
        },
        disable: function() {
            this.disabled = true;
            this.tpl.find('input:text').prop('disabled', true);
        },
        enable: function() {
            this.disabled = false;
            this.tpl.find('input:text').prop('disabled', false);
        },
        change: function() {
            if (this.elem.is(':disabled')) {
                this.disable();
            } else {
                this.enable();
            }
        }
    };

    $.fn.timingfield = function(options) {
        // Iterate and reformat each matched element.
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('timingfield')) return;

            var timingfield = new TimingField(this, options);

            // Store plugin object in this element's data
            element.data('timingfield', timingfield);
        });
    };

    $.fn.timingfield.defaults = {
        width: 263,
        hoursText: 'H',
        minutesText: 'M',
        secondsText: 'S',
        minutesInterval: 1,
        value: 0
    };
	
	var os = getMobileOperatingSystem();
    if (os == "iOS" || os == "Android")
		$.fn.timingfield.template = `<div class="timingfield">
			<div class="timingfield_hours">
				<button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></button>
				<div class="input-group">
					<input type="number" min="0" max="23" class="form-control" maxlength="2" />
					<span class="input-group-addon"></span>
				</div>
				<button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></button>
			</div>
			<div class="timingfield_minutes">
				<button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></button>
				<span class="input-group">
					<input type="number" min="0" max="59" class="form-control" maxlength="2" />
					<span class="input-group-addon"></span>
				</span>
				<button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></button>
			</div>
			<div class="timingfield_seconds">
				<button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></button>
				<span class="input-group">
					<input type="number" min="0" max="59" class="form-control" maxlength="2" />
					<span class="input-group-addon"></span>
				</span>
				<button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></button>
			</div>
		</div>`;
	else
		$.fn.timingfield.template = `<div class="timingfield">
			<div class="timingfield_hours">
				<button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></button>
				<div class="input-group">
					<input type="text" class="form-control" maxlength="2" />
					<span class="input-group-addon"></span>
				</div>
				<button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></button>
			</div>
			<div class="timingfield_minutes">
				<button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></button>
				<span class="input-group">
					<input type="text" class="form-control" maxlength="2" />
					<span class="input-group-addon"></span>
				</span>
				<button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></button>
			</div>
			<div class="timingfield_seconds">
				<button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></button>
				<span class="input-group">
					<input type="text" class="form-control" maxlength="2" />
					<span class="input-group-addon"></span>
				</span>
				<button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></button>
			</div>
		</div>`;
});