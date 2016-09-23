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
      var addLi, attachClickHandler, attachClickList, attachInputHandler, attachMouseEnterHandler, attachMouseLeaveHandler, attachUlHandler, buildWidget, checkSelect, findOption, getData, hideUl, inputSearch, positionUl, removeLi, search, self, setSelectFieldValue, setUnSelectFieldValue, showUl;
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
      positionUl = function($ul) {
        var controlHeight, heightToBottom, heightToTop, pos, scrollPos, val;
        pos = $ul.parent().offset();
        scrollPos = $(window).scrollTop();
        heightToTop = pos.top - scrollPos;
        controlHeight = $ul.parent().outerHeight();
        heightToBottom = $(window).height() - (heightToTop + controlHeight);
        $ul.css('max-height', 'none');
        if (heightToTop > heightToBottom && $ul.height() > heightToBottom) {
          $ul.css('max-height', heightToTop - 10);
          val = -($ul.height());
          $ul.css('top', val);
        } else {
          $ul.css('max-height', heightToBottom - 10);
          $ul.css('top', controlHeight);
        }
      };
      showUl = function($ul) {
        if (!$ul.is(':visible')) {
          self.$ulsearch.addClass('focus');
          $ul.show();
        }
        positionUl($ul);
      };
      hideUl = function($ul) {
        $ul.hide();
        self.$ulsearch.removeClass('focus');
      };
      attachUlHandler = function() {
        self.$ulsearch.on('click', function(e) {
          e.preventDefault();
          if (!self.$ullist.is(':visible') && !self.$inputsearch.is(':focus')) {
            showUl(self.$ullist);
            self.$inputsearch.focus();
          } else if (!self.$ullist.is(':visible')) {
            showUl(self.$ullist);
          } else if (!self.$inputsearch.is(':focus') && self.$ullist.is(':visible')) {
            hideUl(self.$ullist);
          } else if (self.$ullist.is(':visible') && self.$inputsearch.is(':focus')) {
            hideUl(self.$ullist);
          }
        });
      };
      attachInputHandler = function() {
        var $ul;
        $ul = self.$ullist;
        self.$inputsearch.on('focusout', function() {
          if (self.$ullist.is(':visible') && !self.$ulsearch.is(':hover')) {
            if (!self.$ullist.is(':hover')) {
              return hideUl($ul);
            }
          }
        });
      };
      inputSearch = function() {
        var $ul, notfound, searchText;
        searchText = self.$inputsearch.val();
        searchText = searchText.toLowerCase();
        searchText = searchText.replace(/\s+/g, '');
        $ul = self.$ullist;
        if (!self.options.multiple) {
          $ul.find('li a').removeClass(self.options.selectedclass);
        }
        $ul.find('li').each(function() {
          var currentLiText, showCurrentLi;
          currentLiText = $(this).text();
          showCurrentLi = currentLiText.toLowerCase().replace(/\s+/g, '').indexOf(searchText) !== -1;
          $(this).toggle(showCurrentLi);
        });
        if (searchText !== '') {
          showUl($ul);
        }
        if ($ul.find("li:visible a." + self.options.hoverclass).length <= 0) {
          $ul.find('li a').removeClass(self.options.hoverclass);
          $ul.find('li:visible a').first().addClass(self.options.hoverclass);
          $ul.scrollTop(0);
        }
        if ($ul.find('li:visible').length <= 0) {
          notfound = $('<li />', {
            "class": self.options.notfoundclass
          });
          notfound.html(self.options.notfoundtext);
          $ul.append(notfound);
        } else {
          $ul.find("li." + self.options.notfoundclass).remove();
        }
        positionUl($ul);
        if (searchText !== '') {
          self.options.onSearch.call(self, searchText, $ul.find("li:visible a").length);
        }
      };
      attachClickList = function($element) {
        $element.on('click', function(e) {
          var val;
          e.preventDefault();
          e.stopPropagation();
          val = $(this).closest('li').attr('data-niceselect-value');
          self.$ullist.find("a[data-niceselect-value='" + val + "']").trigger('click');
        });
      };
      attachMouseEnterHandler = function() {
        var $elements;
        $elements = self.$ullist.find('a');
        return $elements.on('mouseenter', function() {
          var $a, text, value;
          $a = $(this);
          value = $a.data('niceselect-value');
          text = $a.data('niceselect-text');
          self.options.onHover.call(self, value, text);
          if (self.options.rating) {
            $a.addClass(self.options.ratingclass).closest('li').prevAll().find('a').addClass(self.options.ratingclass);
            return $a.addClass(self.options.ratingclass).closest('li').nextAll().find('a').removeClass(self.options.ratingclass);
          }
        });
      };
      attachMouseLeaveHandler = function() {
        var $elements;
        $elements = self.$ullist.find('a');
        $elements.on('mouseleave', function() {
          if (self.options.rating) {
            return $elements.removeClass(self.options.ratingclass);
          }
        });
      };
      addLi = function($a) {
        var $li, $span;
        $li = $('<li />', {
          'data-niceselect-value': $a.data('niceselect-value'),
          'data-niceselect-text': $a.data('niceselect-text')
        });
        $span = $('<span />', {
          html: $a.data('niceselect-text')
        });
        $a = $('<a />', {
          "class": 'closeelementlist',
          href: '#',
          html: 'x'
        });
        $li.append($span);
        $li.append($a);
        self.$inputsearch.attr('placeholder', '');
        self.$ulsearch.find('li').last().before($li);
        attachClickList($a);
      };
      removeLi = function($a) {
        var $val;
        $val = $a.attr('data-niceselect-value');
        self.$ulsearch.find("[data-niceselect-value='" + $val + "']").remove();
        if (self.$ulsearch.find('li').length < 2) {
          self.$inputsearch.attr('placeholder', self.options.placeholder);
        }
      };
      attachClickHandler = function() {
        var $elements;
        $elements = self.$ullist.find('a');
        $elements.on('mouseover', function() {
          if (self.options.type === 'search') {
            $elements.removeClass(self.options.hoverclass);
            $(this).addClass(self.options.hoverclass);
          }
        });
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
              if (self.options.type === 'search') {
                removeLi($a);
              }
            }
          }
          if (isselect) {
            $a.addClass(self.options.selectedclass);
            setSelectFieldValue(value);
            if (self.options.multiple && self.options.type === 'search') {
              addLi($a);
            }
            self.options.onSelect.call(self, value, text, e);
          }
          if (self.options.type === 'search') {
            text = self.options.multiple ? '' : text;
            self.$inputsearch.val(text);
            if (self.options.multiple) {
              self.$inputsearch.focus();
            }
            hideUl(self.$ullist);
          }
          if (self.options.rating) {
            $a.closest('li').prevAll().find('a').addClass(self.options.selectedclass);
          }
        });
      };
      search = function() {
        var $ul;
        $ul = self.$ullist;
        self.$inputsearch.on('keydown', function(e) {
          var $a, $value, val;
          if (e.keyCode === 8) {
            $ul.find('a').removeClass(self.options.hoverclass);
            $ul.find('li:visible').first().find('a').addClass(self.options.hoverclass);
            $ul.scrollTop(0);
            val = $(this).val();
            if (val === '') {
              $a = self.$ulsearch.find('li').last().prev();
              if ($a.length > 0) {
                $value = $a.attr('data-niceselect-value');
                $ul.find("a[data-niceselect-value='" + $value + "']").trigger('click');
              }
              if ($a.length === 1) {
                self.$inputsearch.css('width', '100%');
              }
            } else {
              positionUl($ul);
            }
          }
          if (e.keyCode === 13) {
            e.preventDefault();
            $a = $ul.find("li:visible a." + self.options.hoverclass).first();
            $a.trigger('click');
            if (!self.options.multiple) {
              $(this).blur();
            }
          }
        });
        self.$inputsearch.on('keyup', function(e) {
          var $a, $el;
          if (e.keyCode === 40) {
            $a = $ul.find("li:visible a." + self.options.hoverclass).first();
            $ul.find("li." + self.options.notfoundclass).remove();
            showUl($ul);
            if ($a.length <= 0 && $ul.find("li:visible").length > 0) {
              $ul.scrollTop(0);
              $ul.find('li:visible a').first().addClass(self.options.hoverclass);
              return $a = $ul.find("li:visible a." + self.options.hoverclass).first();
            } else if ($a.length > 0) {
              $ul.find('li a').removeClass(self.options.hoverclass);
              if ($a.closest('li').nextAll('li:visible').length <= 0) {
                $el = $ul.find('li:visible a').first();
              } else {
                $el = $a.closest('li').nextAll('li:visible').first().find('a').first();
              }
              $el.addClass(self.options.hoverclass);
              return $ul.scrollTop($ul.scrollTop() + $el.closest('li').position().top - $ul.height() / 2 + $el.closest('li').height() / 2);
            }
          } else if (e.keyCode === 38) {
            $a = $ul.find("li:visible a." + self.options.hoverclass).first();
            $ul.find("li." + self.options.notfoundclass).remove();
            showUl($ul);
            if ($a.length <= 0 && $ul.find("li:visible").length > 0) {
              $ul.scrollTop($ul.prop('scrollHeight'));
              $ul.find('li:visible a').last().addClass(self.options.hoverclass);
              return $a = $ul.find("li:visible a." + self.options.hoverclass).last();
            } else if ($a.length > 0) {
              $ul.find('li a').removeClass(self.options.hoverclass);
              if ($a.closest('li').prevAll('li:visible').length <= 0) {
                $el = $ul.find('li:visible a').last().first();
              } else {
                $el = $a.closest('li').prevAll('li:visible').first().find('a').first();
              }
              $el.addClass(self.options.hoverclass);
              return $ul.scrollTop($ul.scrollTop() + $el.closest('li').position().top - $ul.height() / 2 + $el.closest('li').height() / 2);
            }
          } else {
            return inputSearch();
          }
        });
      };
      checkSelect = function($ul) {
        self.$elem.find('option').each((function(_this) {
          return function(i, el) {
            var $a;
            if ($(el).is(':selected')) {
              $a = $ul.find("a[data-niceselect-value='" + ($(el).val()) + "']");
              $a.addClass(self.options.selectedclass);
              if (self.options.rating) {
                $a.closest('li').prevAll().find('a').addClass(self.options.selectedclass);
              }
            }
          };
        })(this));
      };
      buildWidget = function() {
        var $li, $s_ul, $search, $searchdiv, $ul;
        self.$widget = $('<div />', {
          'class': 'ns-widget'
        });
        $ul = $('<ul />', {
          'class': self.options.theme
        });
        if (self.options.type === 'search') {
          $searchdiv = $('<div />', {
            'class': self.options.theme
          });
          $ul.attr('class', 'ul-list');
          $s_ul = $('<ul />', {
            'class': 'ul-search'
          });
          $search = $('<input />', {
            'type': "text",
            'name': "niceselect-search"
          });
          if (self.options.placeholder) {
            $search.attr('placeholder', self.options.placeholder);
          }
          $li = $('<li />', {
            'class': 'niceselect-search-input'
          });
          $li.append($search);
          $s_ul.append($li);
          $searchdiv.append($s_ul);
          $ul.hide();
        }
        self.$elem.find('option').each((function(_this) {
          return function(i, el) {
            var $a, html, text, texts, val;
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
              $li = $('<li />').append($a);
              $ul.append($li);
            }
          };
        })(this));
        checkSelect($ul);
        if (self.options.type === 'search') {
          $searchdiv.append($ul);
          self.$widget.append($searchdiv);
        } else {
          self.$widget.append($ul);
        }
        self.$elem.before(self.$widget);
        self.$ulsearch = self.$widget.find('ul').first();
        self.$ullist = self.$widget.find('ul').last();
        self.$inputsearch = self.$widget.find('input');
        attachClickHandler();
        attachMouseEnterHandler();
        attachMouseLeaveHandler();
        if (self.options.type === 'search') {
          attachUlHandler();
          attachInputHandler();
          search();
          if (self.options.multiple) {
            self.$inputsearch.autoGrowInput({
              minWidth: 100,
              maxWidth: (function(_this) {
                return function() {
                  return $('.niceselect-search-input').width() - 25;
                };
              })(this),
              comfortZone: 10
            });
          }
          if (self.options.multiple) {
            return attachClickList(self.$widget.find('ul').first().find('a'));
          }
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
    hoverclass: 'onhover',
    ratingclass: 'rating',
    notfoundclass: 'not-found',
    notfoundtext: 'No results found',
    showtext: true,
    placeholder: false,
    type: 'select',
    rating: false,
    multiple: false,
    onSelect: function(value, text, event) {},
    onHover: function(value, text) {},
    onSearch: function(value, results) {}
  };
  $.fn.selectnice.SelectNice = SelectNice;
});
