# Function for UI-sided creation of tooltips and popovers for select-/selectizeInput.
# Extends the bsTooltip/bsPopover by an additional input "choice", which lets the user
# define the selectize choice, which should get a tooltip. 
# The selection is more dynamic, dealing with the many mutations on the selectize,
# while still maintaining the right popover on the right elements. 

selectizeTooltip <- function(id, choice, title, placement = "bottom", trigger = "hover", options = NULL){

  options = buildTooltipOrPopoverOptionsList(title, placement, trigger, options)
  buildSelectizeTooltipOrPopover(options, "tooltip", id, choice
}

selectizePopover <- function(id, choice, title, content, placement = "bottom", trigger = "hover", options = NULL){

  options = buildTooltipOrPopoverOptionsList(title, placement, trigger, options, content)
  buildSelectizeTooltipOrPopover(options, "popover", id, choice)
}

buildSelectizeTooltipOrPopover <- function(options, type, id, choice){
  
  options = paste0("{'", paste(names(options), options, sep = "': '", collapse = "', '"), "'}")
  
  bsTag <- shiny::tags$script(shiny::HTML(paste0("
    $(document).ready(function() {
      var opts = $.extend(", options, ", {html: true});
      var selectizeParent = document.getElementById('", id, "').parentElement;
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation){
          $(mutation.addedNodes).filter('div').filter(function(){return(this.getAttribute('data-value') == '", choice, "');}).each(function() {
            $(this).", type, "('destroy');
            $(this).", type, "(opts);
          });
        });
      });
      observer.observe(selectizeParent, { subtree: true, childList: true });
    });
  ")))

  htmltools::attachDependencies(bsTag, shinyBSDep)
}
