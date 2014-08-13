$(".product-form").on("submit", function(e) {
	randomNo = Math.ceil(Math.random() * 1000000);
	var form = $(this);
	form.find(".form_status").show();
	if ($(this).data("formstatus") !== "submitting") {
		var invCheckUrl = "//" + window.location.hostname + "/mm5/merchant.mvc?Screen=INVCHCK&Product_Code=" + form.find("input[name='Product_Code']").val() + "&v=" + randomNo;
		$.ajax({
			url: invCheckUrl,
			cache: false
		}).done(function(invCurrentCount) {
			console.log(invCurrentCount);
			if (Number(invCurrentCount) > 0) {
				var formData = form.serialize(),
					formUrl = form.attr("action"),
					formMethod = form.attr("method");
				form.data("formstatus", "submitting");
				$.ajax({
					url: formUrl,
					type: formMethod,
					data: formData,
					success: function(data, textStatus, jqXHR) {
						if (data.search(/id="js-BASK"/i) != -1) {
							var miniCartUrl = "//" + window.location.hostname + "/mm5/merchant.mvc?Screen=ABSK&v=" + randomNo;
							$.magnificPopup.open({
								items: {
									src: miniCartUrl
								},
								type: "ajax",
								callbacks: {
									parseAjax: function(mfpResponse) {
										$(".current-count").text($(mfpResponse.data).find(".basket-header").attr("data-itemcount"))
									}
								}
							})
						} else {
							if (data.search(/id="js-PATR"/i) != -1) {
								$.magnificPopup.open({
									items: {
										src: '<p class="message message-error">Please select required attributes!</p>'
									},
									type: "inline"
								})
							} else {
								if (data.search(/id="js-PLMT"/i) != -1) {
									form.find(".form-message").html('<p class="message message-error">' + $(data).find(".message").text() + "</p>");
									$.magnificPopup.open({
										items: {
											src: ".message-error"
										},
										type: "inline"
									})
								} else {
									if (data.search(/id="js-PROD"/i) != -1) {} else {
										$.magnificPopup.open({
											items: {
												src: '<p class="message message-error">This product is temporarily out of stock!</p>'
											},
											type: "inline"
										})
									}
								}
							}
						}
						form.find(".form_status").hide();
						form.data("formstatus", "idle")
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(errorThrown);
						alert("Oops... the system encountered a problem. Product was not added to cart!");
						form.data("formstatus", "idle")
					}
				})
			} else {
				$.magnificPopup.open({
					items: {
						src: '<p class="message message-error">This product is temporarily out of stock!</p>'
					},
					type: "inline"
				})
			}
		})
	}
	e.preventDefault();
});
