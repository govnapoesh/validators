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
							
								return answer[errors][this.getElementId()].length
								
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
			
			}
			
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
						new RegularExpressionValueValidator({
							pattern: /[\d]+/,
							error: "Вы ввели плохой текст!"
						})
					]
				})
			]
		})
	
	})
	
})(jQuery)
