(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function($) {
  var SelectNice;
  SelectNice = (function() {
    SelectNice = function() {
      var attachClickHandler, attachInputHandler, attachMouseEnterHandler, buildWidget, findOption, getData, inputSearch, search, self, setSelectFieldValue, setUnSelectFieldValue;
      self = this;
      getData = function(key) {
        var data;
        data = self.$elem.data('selectnice');
        if (typeof key !== 'undefined') {
          return data[key];
        }
        return data;
      };
      setSelectFieldValue = function(value) {
        findOption(value).prop('selected', true);
        self.$elem.change();
      };
      setUnSelectFieldValue = function(value) {
        findOption(value).prop('selected', false);
        self.$elem.change();
      };
      findOption = function(value) {
        if ($.isNumeric(value)) {
          value = Math.floor(value);
        }
        return $("option[value=" + value + "]", self.$elem);
      };
      attachInputHandler = function() {
        var $input, $ul;
        $input = self.$widget.find('input');
        $ul = self.$widget.find('ul');
        $input.on('focus', function() {
          $ul.show();
          inputSearch();
        });
        $input.on('focusout', function() {
          if ($ul.find('li:hover').length <= 0) {
            return $ul.hide();
          }
        });
      };
      inputSearch = function() {
        var $input, searchText;
        $input = self.$widget.find('input');
        searchText = $input.val();
        searchText = searchText.toLowerCase();
        searchText = searchText.replace(/\s+/g, '');
        self.$widget.find('li').each(function() {
          var currentLiText, showCurrentLi;
          currentLiText = $(this).text();
          showCurrentLi = currentLiText.toLowerCase().replace(/\s+/g, '').indexOf(searchText) !== -1;
          $(this).toggle(showCurrentLi);
        });
        if (self.$widget.find("li:visible a." + self.options.selectedclass).length <= 0) {
          self.$widget.find('li a').removeClass(self.options.selectedclass);
          self.$widget.find('li:visible a').first().addClass(self.options.selectedclass);
        }
      };
      attachMouseEnterHandler = function() {
        var $elements;
        $elements = self.$widget.find('a');
        return $elements.on('mouseenter', function() {
          var $a, text, value;
          $a = $(this);
          value = $a.data('niceselect-value');
          text = $a.data('niceselect-text');
          return self.options.onHover.call(self, value, text);
        });
      };
      attachClickHandler = function() {
        var $elements;
        $elements = self.$widget.find('a');
        $elements.on('click', function(e) {
          var $a, isselect, text, value;
          e.preventDefault();
          $a = $(this);
          value = $a.attr('data-niceselect-value');
          text = $a.attr('data-niceselect-text');
          isselect = true;
          if (!self.options.multiple) {
            $elements.removeClass(self.options.selectedclass);
          } else {
            if ($a.hasClass(self.options.selectedclass)) {
              $a.removeClass(self.options.selectedclass);
              setUnSelectFieldValue(value);
              isselect = false;
            }
          }
          if (isselect) {
            $a.addClass(self.options.selectedclass);
            setSelectFieldValue(value);
            self.options.onSelect.call(self, value, text, e);
          }
          if (self.options.type === 'search') {
            $a.closest('ul').hide();
            self.$search.val(text);
          }
        });
      };
      search = function() {
        var $ul, element;
        element = self.$widget.find('input');
        $ul = self.$widget.find('ul');
        element.on('keypress', function(e) {
          var $a;
          if (e.keyCode === 13) {
            e.preventDefault();
            $a = $ul.find("li:visible a." + self.options.selectedclass).first();
            $a.trigger('click');
            $(this).blur();
          }
        });
        element.on('keyup', function(e) {
          var $a, $el;
          if (e.keyCode === 40) {
            $a = $ul.find("li:visible a." + self.options.selectedclass).first();
            $ul.find('li a').removeClass(self.options.selectedclass);
            if ($a.closest('li').nextAll('li:visible').length <= 0) {
              $el = $ul.find('li:visible a').first();
            } else {
              $el = $a.closest('li').nextAll('li:visible').first().find('a').first();
            }
            $el.addClass(self.options.selectedclass);
            return $ul.scrollTop($ul.scrollTop() + $el.closest('li').position().top - $ul.height() / 2 + $el.closest('li').height() / 2);
          } else if (e.keyCode === 38) {
            $a = $ul.find("li:visible a." + self.options.selectedclass).first();
            $ul.find('li a').removeClass(self.options.selectedclass);
            if ($a.closest('li').prevAll('li:visible').length <= 0) {
              $el = $ul.find('li:visible a').last().first();
            } else {
              $el = $a.closest('li').prevAll('li:visible').first().find('a').first();
            }
            $el.addClass(self.options.selectedclass);
            return $ul.scrollTop($ul.scrollTop() + $el.closest('li').position().top - $ul.height() / 2 + $el.closest('li').height() / 2);
          } else {
            inputSearch();
          }
        });
      };
      buildWidget = function() {
        var $ul;
        self.$widget = $('<div />', {
          'class': 'ns-widget'
        });
        $ul = $('<ul />', {
          'class': self.options.theme
        });
        if (self.options.type === 'search') {
          self.$search = $('<input />', {
            'type': "text",
            'name': "niceselect-search"
          });
          self.$widget.append(self.$search);
          $ul.hide();
        }
        self.$elem.find('option').each((function(_this) {
          return function(i, el) {
            var $a, $li, html, text, texts, val;
            val = $(el).val();
            if (val) {
              text = $(el).text();
              html = $(el).data('html');
              if (html) {
                text = html;
              }
              texts = self.options.showtext === false ? '' : text;
              $a = $('<a />', {
                'href': '#',
                'data-niceselect-value': val,
                'data-niceselect-text': text,
                'html': texts
              });
              if ($(el).is(':selected')) {
                $a.addClass(self.options.selectedclass);
              }
              $li = $('<li />').append($a);
              $ul.append($li);
            }
          };
        })(this));
        self.$widget.append($ul);
        self.$elem.before(self.$widget);
        attachClickHandler();
        attachMouseEnterHandler();
        if (self.options.type === 'search') {
          attachInputHandler();
          return search();
        }
      };
      this.show = function() {
        if (getData()) {
          return;
        }
        buildWidget();
        this.$elem.hide();
      };
    };
    SelectNice.prototype.init = function(options, elem) {
      this.$elem = $(elem);
      this.options = $.extend({}, $.fn.selectnice.defaults, options);
      this.options.multiple = $(elem).attr('multiple') ? true : false;
      $.each(this.$elem.data(), (function(_this) {
        return function(i, v) {
          _this.options[i] = v;
        };
      })(this));
      return this.options;
    };
    return SelectNice;
  })();
  $.fn.selectnice = function(method, options) {
    return this.each(function() {
      var plugin;
      plugin = new SelectNice;
      if (!$(this).is('select')) {
        $.error('Sorry, this plugin only works with select fields.');
      }
      if (plugin.hasOwnProperty(method)) {
        plugin.init(options, this);
        if (method === 'show') {
          return plugin.show(options);
        } else {
          if (plugin.$elem.data('selectnice')) {
            plugin.$widget = $(this).next('.ns-widget');
            return plugin[method](options);
          }
        }
      } else if (typeof method === 'object' || !method) {
        options = method;
        plugin.init(options, this);
        return plugin.show();
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.selectnice');
      }
    });
  };
  $.fn.selectnice.defaults = {
    theme: 'select-default',
    selectedclass: 'selected',
    showtext: true,
    type: 'select',
    multiple: false,
    onSelect: function(value, text, event) {},
    onHover: function(value, text) {}
  };
  $.fn.selectnice.SelectNice = SelectNice;
});
