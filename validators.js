(function ($, undefined) {

	$(function () {
	
		var ValueValidator = function (arguments) {
		
			if (arguments) {
			
				var error = "error"
				
				if (error in arguments) {
				
					this.setError(arguments[error])
				
				}
			
			}
		
		}
	
		ValueValidator.prototype.setError = function (error) {
		
			this.error = error
			
			return this
			
		}
		
		ValueValidator.prototype.getError = function () {
			
			return this.error
			
		}
	
		var Exception = function (error) {
			
			if (error) {
			
				this.setError(error)
			
			}
			
		}
		
		Exception.prototype.setError = function (error) {
			
			this.error = error
			
			return this
			
		}
		
		Exception.prototype.getError = function () {
		
			return this.error
		
		}
		
		var RuntimeException = function () {
		
			Exception.apply(this, arguments)
			
		}
	
		RuntimeException.prototype = new Exception()
		
		var ValidationException = function () {
		
			RuntimeException.apply(this, arguments)
		
		}
		
		ValidationException.prototype = new RuntimeException()
		
		var ValueValidationException = function () {
		
			ValidationException.apply(this, arguments)
		
		}
		
		ValueValidationException.prototype = new ValidationException()
	
		var AjaxValueValidationException = function () {
		
			ValueValidationException.apply(this, arguments)
		
		}
	
		AjaxValueValidationException.prototype = new ValueValidationException()
	
		var ValueLengthValidator = function () {
			
			ValueValidator.apply(this, [{"error": "Поле не может быть пустым"}])
			
		}
		
		
		ValueLengthValidator.prototype = new ValueValidator()
	
		ValueLengthValidator.prototype.validate = function (element) {

		if (element.val()) {

			return this
			
			}
			
			else {
			
				throw new ValueValidationException(this.getError())

			}
		}
		
		var RegularExpressionValidator = function (arguments) {
			
			ValueValidator.apply(this, [arguments])
			
			if (arguments) {
			
				var pattern = "pattern"
				
				if (pattern in arguments) {
				
					this.setPattern(arguments[pattern])
				
				}
				
				var error = "error"
				
				if (! (error in arguments)) {
				
					this.setError("Ожидается ввод в формате " + String(this.getPattern()))
				
				}
			
			}
			
		}
		
		RegularExpressionValidator.prototype = new ValueValidator()
		
		RegularExpressionValidator.prototype.setPattern = function (pattern) {
		
			this.pattern = pattern
			
			return this
		
		}
		
		RegularExpressionValidator.prototype.getPattern = function () {
		
			return this.pattern
		
		}
		
		RegularExpressionValidator.prototype.validate = function (element) {
		
			var value = element.val()
			
			if (this.getPattern().test(value)) {
			
				return this
			
			} else {
			
				throw new ValueValidationException(this.getError())
			
			}
		
		}
	
		var ElementValidator = function (arguments) {
			
			if (arguments) {
			
				var element = "element"
				
				if (element in arguments) {
					
					this.setElement(arguments[element])
					
				}
				
				var validators = "validators"
				
				if (validators in arguments) {
				
					this.setValidators(arguments[validators])
				
				}
			
			}
			
		}
		
		ElementValidator.prototype.validate = function () {
		
			var validators = this.getValidators()
			var element = this.getElement()
			
			if (validators) {
			
				var validators_length = validators.length
			
				for (var validator = 0; validator < validators_length; validator++) {
				
					var validator = validators[validator]
					
					validator.validate(element)
				
				}
			
			}
			
			return this
		
		}
		
		ElementValidator.prototype.setValidators = function (validators) {
		
			this.validators = validators
			
			return this
		
		}
		
		ElementValidator.prototype.getValidators = function () {
			
			return this.validators
		
		}
		
		ElementValidator.prototype.setElement = function (element) {
		
			this.element = element
			
			return this
		
		}
		
		ElementValidator.prototype.getElement = function () {
		
			return this.element
		
		}
		
		ElementValidator.prototype.getElementId = function () {
		
			var id = "id"
			
			return this.getElement().attr(id)
			
		}
		
		ElementValidator.prototype.testAjaxAnswer = function (answer) {
		
			if (answer) {
			
				var valid = "valid"
				
				if (valid in answer) {
				
					if (! answer[valid]) {
					
						var errors = "errors"
						
						if (errors in answer) {
						
							if (this.getElementId() in answer[errors]) {
							
								return answer[errors][this.getElementId()]
								
							}
						
						}
					
					}
					
				}
				
			}
			
			return false
			
		}
		
		var Validator = function (arguments) {
			
			if (arguments) {
				
				var form = "form"
				
				if (form in arguments) {
					
					this.setForm(arguments[form])
				
				}
				
				var validators = "validators"
				
				if (validators in arguments) {
				
					this.setValidators(arguments[validators])
					
				}
				
				var validator = "validator"
				
				if (validator in arguments) {
					
					this.setValidator(arguments[validator])
					
				}
				
				var callback = "callback"
				
				if (callback in arguments) {
				
					this.setCallback(arguments[callback])
				
				}
			
			}
			
		}
		
		Validator.prototype.setCallback = function (callback) {
		
			this.callback = callback
			
			return this
		
		}
		
		Validator.prototype.getCallback = function () {
		
			return this.callback
		
		}
		
		Validator.prototype.validate = function () {
		
			var validatorUrl = this.getValidator()
			var validators = this.getValidators()
			var form = this.getForm()
			
			form.find(".field").removeClass("error")
			
			var validators_length = validators.length
			
			var continue_iterating = true
			
			for (var validator_iterator = 0; validator_iterator < validators_length && continue_iterating; validator_iterator++) {
			
				var validator = validators[validator_iterator]
				
				try {
				
					validator.validate()
					
				} catch (exception) {
				
					var element = validator.getElement()
					
					var parent = element.parents(".field")
					
					parent.addClass("error")
					parent.find(".error-txt").html(exception.getError())
					
					continue_iterating = false
				}
			}
		
			//$.post(validatorUrl, form.serialize(), function (answer) {
			
			if (continue_iterating) {
			
			var answer = {errors: {text: ['Required Field']}, valid: true}

				for (var validator_iterator = 0; validator_iterator < validators_length; validator_iterator++) {
				
					var validator = validators[validator_iterator]

					var test = validator.testAjaxAnswer(answer)
					
					if (test.length) {
					
						//throw new AjaxValueValidationException(test[0])
						
						var element = validator.getElement()
						
						var parent = element.parents(".field")
						
						parent.addClass("error")
						
						parent.find(".error-txt").html(test[0])
						
						continue_iterating = false
					
					}
				
				}

			}
			
			if (continue_iterating) {
			
				form.find(".field").removeClass("error")
				
				var callback = this.getCallback()
				
				if (callback) {
				
					callback.apply({}, [this])
				
				}
				
			}
				
			return this
		
		}
		
		Validator.prototype.setValidator = function (validator) {
		
			this.validator = validator
			
			return this
		
		}
		
		Validator.prototype.getValidator = function () {
		
			return this.validator
		
		}
		
		Validator.prototype.setValidators = function (validators) {
		
			this.validators = validators
			
			return this
		
		}
		
		Validator.prototype.getValidators = function () {
		
			return this.validators
		
		}
		
		Validator.prototype.setForm = function (form) {
		
			this.form = form
			
			return this
			
		}
	
		Validator.prototype.getForm = function () {
		
			return this.form
		
		}
		
		var validator = new Validator({
		
			form: $("#form"),
			
			validators: [
			
				new ElementValidator({
				
					element: $("#text"),
					
					validators: [
					
						new RegularExpressionValidator({
						
							pattern: /[\d]+/,
							
							error: "Вы ввели плохой текст!"
							
						})
						
					],
					
					validator: "form_validation.json"
					
				})
				
			],
			
			callback: function (validator) {
				
				console.log("submitting form ", validator.getForm().attr("id"))
				
			}
			
		})
		
		$("#button").click(function () {
		
			try {
			
				validator.validate()
				
			} catch (exception) {
			
				console.log("%o", exception)
			
			}
			
			return false
			
		})
	
	})
	
})(jQuery)
