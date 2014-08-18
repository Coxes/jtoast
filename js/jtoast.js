/*!
 * Jtoast.js  v1.0
 */
(function(win, doc) {
	var jtoast = {};

	function createView(cfg) {
		cfg = cfg || {};

		var content = cfg.content || '', title = cfg.title || '温馨提示';
		var jtoastViewClass = 'jtoast-view';
		var htmlBtn = '';

		if (cfg.shade == false) {
			jtoastViewClass += ' mode-normal';
		} else {
			jtoastViewClass += ' mode-shade';
		}

		if (cfg.btnOk) {
			htmlBtn += '<a href="javascript:;" class="jtoast-btn" property=true >确定</a>';
		}
		if (cfg.btnCancel) {
			htmlBtn += '<a href="javascript:;" class="jtoast-btn" property=false >取消</a>';
		}
		var html = $('<div class="'
				+ jtoastViewClass
				+ '"><div class="jtoast-shade"></div><div class="jtoast-box"><div class="jtoast-title"><span id="close"></span> <span id="title">'
				+ title + '</span></div><div class="jtoast-content">' + content
				+ '<div class="jtoast-opt">' + htmlBtn
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
			content : '<p>' + content + '</p>'
		});
	}
	jtoast.confirm = function(content, callBack) {
		jtoast.show({
			btnOk : true,
			btnCancel : true,
			content : '<p>' + content + '</p>',
			callBack : callBack
		});
	}
	jtoast.modifyPhone = function(submitUrl, sendUrl, validateUrl, callBack) {
		var mobilePhone = /^1[3|4|5|8][0-9]\d{8}$/;
		var html = $('<div class="jtoast-view mode-shade modify"><div class="jtoast-shade"></div><div class="jtoast-box"><div class="jtoast-title"><span id="close"></span> <span id="title">更改手机号码</span></div><div class="jtoast-content"><form method="post" id="jt-sign-form" action="'
				+ submitUrl
				+ '"><div class="jt-item"><label class="jt-label">新手机号码</label><input class="jt-input" type="text" maxlength="11" id="newPhoneNumber" name="newPhoneNumber"></div><div class="jt-item"><span class="mv_msg" id="for-newPhoneNumber"></span></div><div class="jt-item"><label class="jt-label">登录密码</label><input class="jt-input" type="password" maxlength="16" id="loginPassword" name="loginPassword"></div><div class="jt-item"><span class="mv_msg" id="for-loginPassword"></span></div><div class="jt-item"><label class="jt-label">手机验证码</label><input class="jt-input min disable" type="text" value="" maxlength="4" id="validateCode" name="validateCode" readonly="readonly" > <a href="javascript:;" class="blue" id="sendValidateCode">点击获取验证码</a></div><div class="jt-item"><span class="mv_msg" id="for-validateCode"></span></div><div class="jt-item opt"><a href="javascript:void(0)" id="saveNewPhone" class="jtoast-btn4 jt-blue">保存</a></div></form></div></div></div>');
		html.find("#close").click(function() {
			$(this).parents("div:eq(2)").remove();
		});
		html.find("span[id^='for-']").hide();
		$("input[id^='code']")
		html.find("#newPhoneNumber").on("blur", function() {
			if (this.value == "") {
				html.find("#for-" + this.id).show();
				html.find("#for-" + this.id).html("请输入手机号码！");
				return;
			}
			if (!mobilePhone.test(this.value)) {
				html.find("#for-" + this.id).show();
				html.find("#for-" + this.id).html("手机号码格式不正确");
				return;
			}
			html.find("#for-" + this.id).hide();
		});

		html.find("#loginPassword").on("blur", function() {
			if (this.value == "") {
				html.find("#for-" + this.id).show();
				html.find("#for-" + this.id).html("请输入登录密码！");
				return;
			}
			html.find("#for-" + this.id).hide();
		});

		html.find("#validateCode").on("blur", function() {
			if ($("#validateCode").attr("readonly") != "readonly") {
				if (this.value == "") {
					html.find("#for-validateCode").html("请输入验证码！");
					html.find("#for-validateCode").show();
					return;
				}
				$.post(validateUrl, {
					code : this.value,
					mobile : $("#newPhoneNumber").val()
				}, function(result) {
					if (result.code == 0) {
						html.find("#for-validateCode").hide();
					} else {
						html.find("#for-validateCode").html("验证码输入有误");
						html.find("#for-validateCode").show();
					}
				});
			}
		});

		html.find("#saveNewPhone").on("click", function() {
			html.find("input").blur();
			if ($("#validateCode").attr("readonly") == "readonly") {
				html.find("#for-validateCode").html("请输入验证码！");
				html.find("#for-validateCode").show();
			}

			if ($("span[id^=for-]:visible").length == 0) {

				$.post(submitUrl, {
					newPhoneNumber : html.find("#newPhoneNumber").val(),
					loginPassword : html.find("#loginPassword").val(),
					validateCode : html.find("#validateCode").val()
				}, function(result) {
					if (result.code == 0) {
						callBack();
					} else {
						for (var key in result.attachment) {
							html.find("#for-"+key).html(result.attachment[key]);
							html.find("#for-"+key).show();
						}
					}
				});

			}
		});

		html.find("#sendValidateCode").click(function() {
			if (window.countDown == undefined) {
				if (mobilePhone.test($("#newPhoneNumber").val())) {
					$.post(sendUrl, {
						mobile : $("#newPhoneNumber").val()
					}, function(result) {
						if (result.code == 0) {
							sendCountDown($("#sendValidateCode"));
							html.find("#validateCode").removeAttr("readonly");
							html.find("#validateCode").removeClass("disable");
						}
					});
				} else {
					$("#newPhoneNumber").blur();
					$("#newPhoneNumber").focus();
				}
			}
		});

		function sendCountDown(elm) {
			if (window.countDown == undefined) {
				window.countDown = 90;
			}
			if (window.countDown > 0) {
				elm.html("(" + window.countDown + ")重新发送");
				setTimeout(function() {
					window.countDown--;
					sendCountDown(elm);
				}, 1000);
			} else {
				elm.html("重新发送");
				window.countDown = undefined;
			}
		}

		$('body').append($(html));
	}
	jtoast.html = function(html) {

	}
	win.jtoast = jtoast;
})(window, document);