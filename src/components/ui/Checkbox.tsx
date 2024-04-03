
import type { Task } from "../../types";

interface Props { 
  value: boolean;
  onChange: (content: Partial<Task>) => void;
}
const Checkbox = ({ value, onChange }: Props) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
    </label>
  );
};

export default Checkbox;