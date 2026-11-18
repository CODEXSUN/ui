/** HTML rendering for static public sites. React apps use the component exports. */
const escapeAttribute = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function input({id='',name='',type='text',placeholder=''}: {id?:string;name?:string;type?:string;placeholder?:string} = {}) {
 return `<input class="ui-input" type="${escapeAttribute(type)}"${id?` id="${escapeAttribute(id)}"`:''}${name?` name="${escapeAttribute(name)}"`:''} placeholder="${escapeAttribute(placeholder)}">`;
}
export function select({id,options}: {id:string;options:readonly {value:string;label:string}[]}) {
 return `<select class="ui-select" id="${escapeAttribute(id)}">${options.map(({value,label})=>`<option value="${escapeAttribute(value)}">${escapeAttribute(label)}</option>`).join('')}</select>`;
}
export function button(label: string,{variant='default',id='',type='button'}: {variant?:'default'|'outline';id?:string;type?:'button'|'submit'|'reset'}={}) {
 return `<button class="ui-button ui-button--${escapeAttribute(variant)}" type="${escapeAttribute(type)}"${id?` id="${escapeAttribute(id)}"`:''}>${escapeAttribute(label)}</button>`;
}
/** control must be trusted markup returned by a shared control renderer. */
export function field(label: string,control: string) { return `<label class="ui-field"><span class="ui-label">${escapeAttribute(label)}</span>${control}</label>`; }
