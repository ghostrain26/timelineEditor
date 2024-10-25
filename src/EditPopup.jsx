import { useState } from 'react';



export default function EditPopup({currentlyEditing, setCurrentlyEditing, removeArcById, replaceArc}) { 
    let [newItem, setNewItem] = useState(currentlyEditing)

    function handleItemChange(property, newVal){
        console.log("handle item change", property, newVal)
        setNewItem((prev) => {
            let copy = {... prev}
            copy[property] = newVal
            return copy
        })
    }

    function saveItem() {
        replaceArc(currentlyEditing.id, newItem) // sends the item to the Timeline. 
        setCurrentlyEditing(null)
    }

    function deleteItem() { 
        removeArcById(currentlyEditing.id)
    }

    return (
        <div style={
            {
                left: '0em',
                top: '0em',
                position: 'absolute',
                display: 'flex',
                flex: '1',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center', 
                zIndex: '95',
                background: '#242424AA',
            }}>

                <div  style={{
                    color: 'black', 
                    height: '10em', 
                    width: '20em', 
                    background: "white",
                    borderRadius: '1em'
                }}>
                    <h4>Editing:</h4>
                    <div>Title:</div>

                    <input style={{background: "white", color: 'black', margin: '0em'}}  type="text"  onChange={(event) => handleItemChange('title', event.target.value)} defaultValue={newItem.title} />

                    <button 
                        onClick={saveItem}
                        style={{
                            width: '100%',
                            margin: '1em 0em',
                            padding: '.5em 0em',
                            color: 'black',
                            background: 'lightgreen',
                            borderRadius: '1em',
                        }}>
                            Save Item
                    </button>
                </div>

        </div>
    )
}
