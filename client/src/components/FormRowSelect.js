
const FormRowSelect = ({labelText,name,value,handleChange,list}) => {
  return (
    <div className="formRow">
            <label htmlFor={name} className='form-label'>
                {labelText || name}
                </label>

            <select
            name={name}
            value={value}
            onChange={handleChange}
            className="btn btn-block submit-btn"
            >
              {
              list.map((itemValue,index)=>{
                return <option key={index} value={itemValue}>
                  {itemValue}
                </option>
              })}
            </select>
          </div>
  )
}
export default FormRowSelect