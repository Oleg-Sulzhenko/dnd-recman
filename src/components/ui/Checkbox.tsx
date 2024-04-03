interface Props { 
  value: boolean;
  onChange: () => void;
}
const Checkbox = ({ value, onChange }: Props) => {

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log('Checkbox chanfge: ', e)
  //   e.stopPropagation()
  //   onChange();
  // }

  return (
    <input id="bordered-checkbox-1" type="checkbox" name="bordered-checkbox" 
      checked={value}
      onChange={onChange} 
      className="
        w-4 h-4 
        text-blue-600 
        bg-gray-100 
        border-gray-300 
        rounded 
      "
    />
  );
};

export default Checkbox;