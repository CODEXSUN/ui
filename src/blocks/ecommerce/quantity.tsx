import { Minus, Plus } from 'lucide-react';
import { Button } from '../../components/button.js';
export function StorefrontQuantity({ name, value, onChange, onRemove, max = 99 }: { name: string; value: number; onChange: (value: number) => void; onRemove?: () => void; max?: number }) {
  return <div className="ec-quantity"><Button type="button" variant="outline" size="icon-sm" aria-label={`Decrease ${name} quantity`} disabled={value <= 1 && !onRemove} onClick={() => onChange(value - 1)}><Minus/></Button><span aria-label={`Quantity ${value}`}>{value}</span><Button type="button" variant="outline" size="icon-sm" aria-label={`Increase ${name} quantity`} disabled={value >= Math.min(99, max)} onClick={() => onChange(value + 1)}><Plus/></Button>{onRemove && <Button type="button" variant="link" onClick={onRemove}>Remove</Button>}</div>;
}
