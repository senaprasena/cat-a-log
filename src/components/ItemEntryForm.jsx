import { useState } from 'react';

const DEFAULT_TYPES = ['Fruit', 'Vegetable', 'Other', 'Enter a new type...'];

function ItemEntryForm({ onAddItem }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(DEFAULT_TYPES[0]);
  const [customType, setCustomType] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [supplier, setSupplier] = useState('');
  const [picture, setPicture] = useState('');

  const isCustomType = type === 'Enter a new type...';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate price and amount as numbers
    if (isNaN(price) || isNaN(amount)) {
      alert('Price and Amount must be numbers.');
      return;
    }
    const itemType = isCustomType ? customType : type;
    const newItem = { name, type: itemType, price, amount, supplier, picture };
    if (onAddItem) onAddItem(newItem);
    setName('');
    setType(DEFAULT_TYPES[0]);
    setCustomType('');
    setPrice('');
    setAmount('');
    setSupplier('');
    setPicture('');
  };

  return (
    <form className="item-entry-form" onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Type:</label>
        {isCustomType ? (
          <input
            value={customType}
            onChange={e => setCustomType(e.target.value)}
            placeholder="Enter new type"
            required
          />
        ) : (
          <select value={type} onChange={e => setType(e.target.value)}>
            {DEFAULT_TYPES.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label>Price:</label>
        <input type="text" value={price} onChange={e => setPrice(e.target.value)} required pattern="[0-9.]*" inputMode="decimal" />
      </div>
      <div>
        <label>Amount:</label>
        <input type="text" value={amount} onChange={e => setAmount(e.target.value)} required pattern="[0-9]*" inputMode="numeric" />
      </div>
      <div>
        <label>Supplier:</label>
        <input value={supplier} onChange={e => setSupplier(e.target.value)} required />
      </div>
      <div>
        <label>Picture:</label>
        <input value={picture} onChange={e => setPicture(e.target.value)} placeholder="Image URL (optional)" />
      </div>
      <button type="submit">Enter</button>
    </form>
  );
}

export default ItemEntryForm; 