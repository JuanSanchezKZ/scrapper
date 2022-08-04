

export function $(selector, node=document.body) {
   return node.querySelector(selector) 
}


export function $$(selector, node=document.body) {
    return [...node.querySelectorAll(selector)]
}

