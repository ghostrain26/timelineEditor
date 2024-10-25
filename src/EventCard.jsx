import moment from 'moment'
import { useState } from 'react';
import Select from 'react-select'
export default function EventCard({item, replaceItem, removeItemById, deselectItem}) { 
    /**
     * Diplay different years/times/based on where you are in the calendar
     * @param {*} timestamp 
     * @returns 
     */
    const [newDescription, setNewDescription] = useState(item.itemProps.longDescription)
    const [newTitle, setNewTitle] = useState(item.title)
    const [newTags, setNewTags] = useState(item.itemProps.tags)
    const [newTagTitle, setNewTagTitle] = useState("NewTag")
    const [editMode, setEditMode] = useState(false)
    // CHANGE TO FIX vvvvvvvv

    function handleTitleChange(event){
        setNewTitle(event.target.value); 
    }
    function handleRemoveTag(_tag){
        setNewTags(prev => prev.filter((tagname) => tagname != _tag))
    }
    function handleAddTag(){
        setNewTags(prev => [... new Set([...prev, newTagTitle])]); 
    }
    function handleNewTagTitleChange(event){
        if (event.target.value != ""){
            setNewTagTitle(event.target.value); 
        } else {
            console.log("Can't add empty tag!")
        }
    }
    function handleDescriptionChange(event){
        setNewDescription(event.target.value); 
    }

    function enterEditMode() { // make a modal open
        setEditMode(true)
    }

    function editEvent() { // make a modal open
        const newItem = { ... item }
        console.log('edit event')
        newItem.title = newTitle
        item.itemProps.longDescription = newDescription
        item.itemProps.tags = newTags
        setEditMode(false)
        replaceItem(item.id, newItem)
    }


    // CHANGE TO FIX ^^^^^ 

    function convertUNIXToDateTime(timestamp, format){ 
        return moment(timestamp).format(format);
    }
    const [optionsOpen, setOptionsOpen] = useState(false)
    function handleOptionsClick() { 
        setOptionsOpen((prev) => !prev)
    }

    function deleteEvent() {
        removeItemById(item.id)
    }

    return (
    <div class="event_card" style={{
        width: '20em', 
        border:`1em ${item}`, 
        background:'none', 
        padding:'0em', 

        }}>
            <div style={{
            // background:"#111111",
            marginTop: '3.25em', 
            marginLeft: optionsOpen ? '20em' : '0em',
            position: 'absolute',
            zIndex: '-1',
            width: '8em',
            transition: 'margin-left 0.5s ease',
            // borderRadius: '1em',
            // fontWeight: 'bold'
            }}>
            <button 
            onClick={editMode ? editEvent : enterEditMode}
            style={{
                width: '100%',
                padding: '.5em 0em',
                color: 'black',
                background: item.itemProps.primaryColor,
                borderRadius: '0em 1em 1em 0em',
                boxShadow: 'inset 1em 0em 1em -1em #11111199',
                marginBottom: '.5em',
            }}>
                {editMode ? "Save Edit" : "Edit Event"}
            </button>
            <button 
            onClick={deleteEvent}
            style={{
            width: '100%',
            padding: '.5em 0em',
            color: 'red',
            borderRadius: '0em 1em 1em 0em',
            boxShadow: 'inset 1em 0em 1em -1em #11111199',
            background: '#EEEEEE'
            }}>Delete Event</button>

        </div>
    
        <div style={{
            background:"#111111",
            color:"white",
            width: 'fit',
            maxWidth: '60%',
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            margin: '0em 0em -1em 1em', 
            position: 'relative',
            zIndex: '1',
            borderRadius: '1em',
            fontWeight: 'bold'
            }}>
            {editMode ? 
            <input style={{background: "white", color: 'black'}} onMouseDown={(e)=> {e.stopPropagation()}}  type="text"  onChange={handleTitleChange} value={newTitle} />
            : 
            <>{item.title}</>
            } 
            
        </div>

        <div style={
            {
                background:"none", 
                display:'flex', 
                flex: '1', 
                flexDirection:'column', 
            }}>

            <div style={{
                background:item.itemProps.primaryColor, 
                display:'flex',  
                flex: '1', 
                justifyContent:'flex-end', 
                overflow: 'hidden',
                borderRadius: '1em 1em 0em 0em',
                }}>
                <button onClick={handleOptionsClick} style={{height: '2em', width: '2em', padding: '0em', margin: '.25em', background: '#EEEEEEAA'}}>
                    <box-icon name='menu' style={{height: '100%', width: '100%'}}></box-icon>
                </button>
                <button onClick={() => deselectItem(item.id)} style={{height: '2em', width: '2em', padding: '0em', margin: '.25em', background: '#EEEEEEAA'}}>
                    <box-icon name='x' style={{height: '100%', width: '100%'}}></box-icon>
                </button>
            </div>

            <div style={{
                background: '#EEEEEE',
                color: 'black',
                display:'flex', 
                height:'1em', 
                flex: '1', 
                flexDirection:'row',
                borderRadius: '0em 0em 1em 1em '
                }}>
                    
                <div style={{ width: '80%', margin: ".25em"}}> 

                    {editMode ? 
                    <input type="text" style={{background: "white", color: 'black'}} onMouseDown={(e)=> {e.stopPropagation()} } onChange={handleDescriptionChange} value={newDescription}/>
                    : 
                    <div style={{textWrap: 'wrap',}}> 
                        {item.itemProps.longDescription}
                    </div>
                    }
                    {/* <div style ={{color: item.itemProps.primaryColor, fontWeight: 'bold'}}>{groupName}</div> */}
                    <div style={{
                        margin: '1em 0em 0em 0em', 
                        display: 'flex',
                        flexWrap:'wrap', 
                        flex: '1',
                        overflow: 'auto', 
                        }}>
                        {editMode ? 
                            <>
                                {newTags.map((tag) => {
                                    return (
                                    <div style={{ padding: '0em .5em', margin: '.25em', borderRadius: '.5em', background: 'white'}}>
                                        {tag}
                                        <button  style={{ padding: '0em', margin: '.25em', width: "1.5em", background:'#55555544', color:'white', fontWeight: 'bold'}} onClick={(e) => {handleRemoveTag(tag)}}>⨯</button>
                                    </div>
                                    )
                                })}
                                <div>
                                    <input type="text" style={{background: "white", width: '80%', color: 'black'}} onMouseDown={(e)=> {e.stopPropagation()} } onChange={handleNewTagTitleChange} value={newTagTitle}/>
                                    <button onClick={handleAddTag} style={{padding: '0em', margin: '.25em', width: "1.5em", background:'#55555544', color:'white', fontWeight: 'bold'}}>+</button>
                                </div>
                            </>
                        : 
                            <>{item.itemProps.tags.map((tag) => {
                                return (
                                <div style={{ padding: '0em .5em', margin: '.25em', borderRadius: '.5em', background: 'white'}}>
                                    {tag}
                                </div>
                                )
                            })}</>
                        }
                    </div>
                </div>
                
                <div style={{
                    minWidth: '5em', 
                    margin: ".25em", 
                    borderRadius: '1em', 
                    height: '6em', 
                    background:"white", 
                    border: "solid #BBBBBB",
                    color: '#333333',
                    display:'flex', flex: '1', 
                    flexDirection:'column', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    overflow: 'hidden'
                    }}>
                    <div style ={{margin: '0em', fontSize: '1.25em'}}>{convertUNIXToDateTime(item.start_time,"MMM")}</div>
                    <div style ={{ margin:'.125em 0em', fontSize: '2.5em'}}>{convertUNIXToDateTime(item.start_time,"D")}</div>        
                    <div style ={{margin: '0em', fontSize: '1.25em'}}>{convertUNIXToDateTime(item.start_time,"YYYY")}</div>
                </div>

            </div>
        </div>

    </div>)
}
