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
	
		var ElementValidator = function (arguments) {
			
			if (arguments) {
			
				var element = "element"
				
				if (element in arguments) {
					
					this.setElement(arguments[element])
					
				}
				
				var valueValidators = "valueValidators"
				
				if (valueValidators in arguments) {
				
					this.setValueValidators(arguments[valueValidators])
				
				}
			
			}
			
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
				
				var elementValidators = "elementValidators"
				
				if (elementValidators in arguments) {
				
					this.setElementValidators(arguments[elementValidators])
					
				}
			
			}
			
		}

		Validator.prototype.setElementValidators = function (elementValidators) {
		
			this.elementValidators = elementValidators
			
			return this
		
		}
		
		Validator.prototype.getElementValidators = function () {
		
			return this.elementValidators
		
		}
		
		Validator.prototype.setForm = function (form) {
		
			this.form = form
			
			return this
			
		}
	
		Validator.prototype.getForm = function () {
		
			return this.form
		
		}
	
	})
	
})(jQuery)
