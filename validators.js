(function ($, window__, undefined__) {

	$(function () {

		var validators = {}
	
		validators.ValueValidator = function (arguments) {
		
			if (arguments) {
			
				var error = "error"
				
				if (error in arguments) {
				
					this.setError(arguments[error])
				
				}
			
			}
		
		}
	
		validators.ValueValidator.prototype.setError = function (error) {
		
			this.error = error
			
			return this
			
		}
		
		validators.ValueValidator.prototype.getError = function () {
			
			return this.error
			
		}
	
		validators.Exception = function (error) {
			
			if (error) {
			
				this.setError(error)
			
			}
			
		}
		
		validators.Exception.prototype.setError = function (error) {
			
			this.error = error
			
			return this
			
		}
		
		validators.Exception.prototype.getError = function () {
		
			return this.error
		
		}
		
		validators.RuntimeException = function () {
		
			validators.Exception.apply(this, arguments)
			
		}
	
		validators.RuntimeException.prototype = new validators.Exception()
		
		validators.ValidationException = function (message, validator) {
		
			validators.RuntimeException.apply(this, arguments)
			
			if (validator) {
			
				this.setValidator(validator)
			
			}
		
		}
		
		validators.ValidationException.prototype = new validators.RuntimeException()
		
		validators.ValidationException.prototype.setValidator = function (validator) {
		
			this.validator = validator
			
			return this
		
		}
		
		validators.ValidationException.prototype.getValidator = function () {
		
			return this.validator
		
		}
		
		validators.ValueValidationException = function () {
		
			validators.ValidationException.apply(this, arguments)
		
		}
		
		validators.ValueValidationException.prototype = new validators.ValidationException()
	
		validators.AjaxValueValidationException = function () {
		
			validators.ValueValidationException.apply(this, arguments)
		
		}
	
		validators.AjaxValueValidationException.prototype = new validators.ValueValidationException()
	
		validators.ValueLengthValidator = function () {
			
			validators.ValueValidator.apply(this, [{"error": "Поле не может быть пустым"}])
			
		}
		
		
		validators.ValueLengthValidator.prototype = new validators.ValueValidator()
	
		validators.ValueLengthValidator.prototype.validate = function (element) {

		if (element.val()) {

			return this
			
			}
			
			else {
			
				throw new validators.ValueValidationException(this.getError())

			}
		}
		
		validators.RegularExpressionValidator = function (arguments) {
			
			validators.ValueValidator.apply(this, [arguments])
			
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
		
		validators.RegularExpressionValidator.prototype = new validators.ValueValidator()
		
		validators.RegularExpressionValidator.prototype.setPattern = function (pattern) {
		
			this.pattern = pattern
			
			return this
		
		}
		
		validators.RegularExpressionValidator.prototype.getPattern = function () {
		
			return this.pattern
		
		}
		
		validators.RegularExpressionValidator.prototype.validate = function (element) {
		
			var value = element.val()
			
			if (this.getPattern().test(value)) {
			
				return this
			
			} else {
			
				throw new validators.ValueValidationException(this.getError())
			
			}
		
		}
	
		validators.OnlyLettersValidator = function () {
		
			validators.RegularExpressionValidator.apply(this, [{
			
					error: "Вводите латиницу или символ _",
					
					pattern: /[a-z\_]+/i
					
				}]
				
			)
		
		}
		
		validators.OnlyLettersValidator.prototype = new validators.RegularExpressionValidator()
	
		validators.OnlyNumberValidator = function () {
			
			validators.RegularExpressionValidator.apply(this, [{
			
					error: "Вводите только цифры",
					
					pattern: /[0-9]+/
			
				}]
			)
			
		}
		
		validators.OnlyNumberValidator.prototype = new validators.RegularExpressionValidator()
		
		validators.TitleValidator = function () {
		
			validators.RegularExpressionValidator.apply(this, [{
			
					error: "Вводите только буквы и пробельные символы",
					
					pattern: /[a-z\s]+/
			
				}]
			)
			
		}
		
		validators.TitleValidator.prototype = new validators.RegularExpressionValidator()
	
		validators.ElementValidator = function (arguments) {
			
			if (arguments) {
			
				var element = "element"
				
				if (element in arguments) {
					
					this.setElement(arguments[element])
					
				}
				
				var validators = "validators"
				
				if (validators in arguments) {
				
					this.setValidators(arguments[validators])
				
				}
				
				var critical = "critical"
				
				var defaultCritical = false
				
				if (critical in arguments) {
				
					this.setCritical(arguments[critical])
				
				} else {
				
					this.setCritical(defaultCritical)
				
				}
			
			}
			
		}
		
		validators.ElementValidator.prototype.setCritical = function (critical) {
			
			this.critical = critical
			
			return this
		
		}
		
		validators.ElementValidator.prototype.getCritical = function () {
		
			return this.critical
		
		}
		
		validators.ElementValidator.prototype.validate = function () {
		
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
		
		validators.ElementValidator.prototype.setValidators = function (validators) {
		
			this.validators = validators
			
			return this
		
		}
		
		validators.ElementValidator.prototype.getValidators = function () {
			
			return this.validators
		
		}
		
		validators.ElementValidator.prototype.setElement = function (element) {
		
			this.element = element
			
			return this
		
		}
		
		validators.ElementValidator.prototype.getElement = function () {
		
			return this.element
		
		}
		
		validators.ElementValidator.prototype.getElementId = function () {
		
			var id = "id"
			
			return this.getElement().attr(id)
			
		}
		
		validators.ElementValidator.prototype.testAjaxAnswer = function (answer) {
		
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
		
		validators.Validator = function (arguments) {
			
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
		
		validators.Validator.prototype.setCallback = function (callback) {
		
			this.callback = callback
			
			return this
		
		}
		
		validators.Validator.prototype.getCallback = function () {
		
			return this.callback
		
		}
		
		validators.Validator.prototype.validate = function () {
		
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
				
					callback.apply(this, [])
				
				}
				
			}
				
			return this
		
		}
		
		validators.Validator.prototype.validateField = function (element) {
			var validatorUrl = this.getValidator()
			var validators = this.getValidators()
			var form = this.getForm()
			
			// form.find(".field").removeClass("error")
			
			element.parents(".field").removeClass("error")
			element.parents(".field").find(".error-txt").html("")
			
			var validators_length = validators.length
			
			var continue_iterating = true
			
			var validator = undefined__
			
			for (var validator_iterator = 0; validator_iterator < validators_length && continue_iterating; validator_iterator++) {
			
				validator = validators[validator_iterator]
				
				var validator_element = validator.getElement()
				
				if (validator_element.attr("id") == element.attr("id")) {
				
					try {
				
						validator.validate()
						
						continue_iterating = false
					
					} catch (exception) {
				
						var element = validator.getElement()
					
						var parent = element.parents(".field")
					
						parent.addClass("error")
						parent.find(".error-txt").html(exception.getError())
					
						continue_iterating = false
					}
					
				}
				
			}
		
			if (continue_iterating && validator.getCritical()) {
			
			$.post(validatorUrl, form.serialize(), function (answer) {
			
				//var answer = {errors: {text: ['Required Field']}, valid: true}

				for (var validator_iterator = 0; validator_iterator < validators_length; validator_iterator++) {
				
					validator = validators[validator_iterator]
					
					var validator_element = validator.getElement()
					
					if (validator_element.attr("id") == element.attr("id")) {

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

			})
		}
		
		}
		
		validators.Validator.prototype.setValidator = function (validator) {
		
			this.validator = validator
			
			return this
		
		}
		
		validators.Validator.prototype.getValidator = function () {
		
			return this.validator
		
		}
		
		validators.Validator.prototype.setValidators = function (validators) {
		
			this.validators = validators
			
			return this
		
		}
		
		validators.Validator.prototype.getValidators = function () {
		
			return this.validators
		
		}
		
		validators.Validator.prototype.setForm = function (form) {
		
			this.form = form
			
			return this
			
		}
	
		validators.Validator.prototype.getForm = function () {
		
			return this.form
		
		}
		
		window.validators = validators
		
	})
})(jQuery, window)
