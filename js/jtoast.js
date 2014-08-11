/*!
 * Jtoast.js  v1.0
 */
(function(win, doc) {
	var jtoast = {};

	function createView(cfg) {
		cfg = cfg || {};

		var content = cfg.content || '', title = cfg.title || '温馨提示', htmlBtn = '', shadeClass = 'jtoast-shade';

		if (cfg.shade == false) {
			shadeClass += ' jtoast-sv-00';
		}
		if (cfg.btnOk) {
			htmlBtn += '<a href="javascript:;" class="jtoast-btn" property=true >确定</a>';
		}
		if (cfg.btnCancel) {
			htmlBtn += '<a href="javascript:;" class="jtoast-btn" property=false >取消</a>';
		}
		var html = $('<div class="jtoast-view"><div class="'
				+ shadeClass
				+ '"></div><div class="jtoast-box"><div class="jtoast-title"><span id="close"></span> <span id="title">'
				+ title + '</span></div><div class="jtoast-content"><p>'
				+ content + '</p><div class="jtoast-opt">' + htmlBtn
				+ '</div></div></div></div>');
		return html;
	}
	jtoast.show = function(cfg) {
		var html = createView(cfg);
		html.find("#close").click(function() {
			$(this).parents("div:eq(2)").remove();
		});
		html.find(".jtoast-btn").click(function() {
			$(this).parents("div:eq(3)").remove();
			if (cfg.callBack) {
				cfg.callBack($(this).attr("property") == 'true');
			}
		});
		$('body').append($(html));
	}
	jtoast.alert = function(content) {
		jtoast.show({
			btnOk : true,
			content : content
		});
	}
	jtoast.confirm = function(content, callBack) {
		jtoast.show({
			btnOk : true,
			btnCancel : true,
			content : content,
			callBack : callBack
		});
	}
	jtoast.html = function(html) {

	}
	win.jtoast = jtoast;
})(window, document);