import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { useState, useEffect} from 'react'
import "./TimelineDisplay.css";
import 'boxicons' // icons 
import EventCard from './EventCard.jsx';
import EditPopup from './EditPopup.jsx'

export default function TimelineDisplay({initialItems, initialGroups, initialId}) { 

  useEffect(() => {
    console.log("change in initial")

    console.log(initialGroups)
    console.log(initialItems)
    console.log(initialId)

    setGroups(initialGroups);
    setItems(initialItems);
    setNextOpenId(initialId+1);

  }, [initialItems, initialGroups, initialId]);

    const [openModal, setOpenModal]= useState(null) // ItemID for open Description Boxes
    const [groups, setGroups] = useState(initialGroups) // Groups/Arcs
    const [items, setItems] = useState(initialItems) // 
    const [nextOpenId, setNextOpenId] = useState(initialId) // 
    const [tagList, setTagList] = useState([]) // 

    const [currentlyEditing, setCurrentlyEditing]= useState(null) // item currently being edited. 
    
    const group_colors = ['red', 'orange', 'yellow', 'lightgreen', 'darkgreen', 'lightblue', 'darkblue', 'purple', 'pink', 'brown', 'grey', 'gold']
    const hex_colors = ['#eb2f29','#f69548','#fecb18','#7ac142','#2bb6e6','#00a34d','#015396','#914499','#db74ae','#a15c2f','#7c878e','#978e2e'] 
    // const boxicon_names = ['radio-circle','cake', 'star', 'graduation', 'bullseye', 'certification', 'circle', 'heart'] // For Future Customization
    
    /**
     *  Creates New Blank Item Inside groupId, sets its time to _time
     * @param {Int16Array} _groupId 
     * @param {Timestamp} _time 
     */
    function createItem(_groupId, _time){
      const groupTitle = idToGroupName(_groupId)
      const newItem = {
        id: nextOpenId,
        title: ("Event " + nextOpenId),
        group: _groupId,
        start_time: _time,
        end_time: _time + 3600000, 
        itemProps: {
          style: {
            color: "white",
            background: '#00000000',
            border: '0px'
          }, 
          arcTitle: groupTitle,
          primaryColor: '#00000000',
          longDescription: "Description",
          tags: []
        }
      }
      setNextOpenId((prev) => {return (prev + 1)});
      setItems((prev) => [...prev, newItem])
    }
    /**
     * Refreshes List of Tags, using Items array useState
     */
    function refreshTagList() { 
      let allTags = []
      items.forEach( (item) => { item.itemProps.tags.forEach(tag => allTags.push(tag))})
      setTagList([...new Set(allTags)])
    }
    /**
     * @param {Int16Array} itemId 
     * @param {Int16Array} dragTime 
     * @param {*} newGroupOrder 
     */
    function moveItem(itemId, dragTime, newGroupOrder) { 
      let newItem = { ... getItemById(itemId) }
      newItem.start_time = dragTime
      newItem.end_time = dragTime + 3600000
      replaceItem(itemId, newItem)
    }

    function replaceItem(itemId, newItem) {
      removeItemById(itemId)
      setItems((prev) => { return [... prev, newItem]})
    }

    function replaceArc(id, newArc) { // TODO: eventually replace the ReplaceItem to be the same fu
      removeArcById(id)

      setGroups((prev) => {
        let prevCopy = [...prev]
        const lowestInsertionPoint = prevCopy.findIndex(item => id < item.id); // insert in ascending order index. 
        if (lowestInsertionPoint === -1) {
          prevCopy.push(newArc);
        } else {
          console.log("insert at ", lowestInsertionPoint)
          prevCopy.splice(lowestInsertionPoint, 0, newArc);
        }
    
        return prevCopy
      })
    }

    /**
     *  Removes item of id from Items useState
     * @param {Int16Array} id 
     */
    function removeItemById(id) {
      const filtered = items.filter(item => item.id !== id)
      setItems((prev) => { return filtered})
    }

    function removeArcById(id) {
      const filtered = groups.filter(arc => arc.id !== id)
      console.log('removed id', id)
      setGroups((prev) => { return filtered})
    }

    /**
     * @param {Int16Array} id 
     * @returns Item reference or undefined
     */
    function getItemById(id) {
      return items.filter(item => item.id === id).pop();
    }
    function getArcById(id) {
      return groups.filter(item => item.id === id).pop();
    }

    function selectItem(itemId, e, time) { // spawn a Description box
      console.log('selectitem')
      setOpenModal(itemId)
    }

    function deselectItem(e) { //Delete all Description boxes when deselected
      console.log('deselectitem')
      setOpenModal(null)
      console.log("openmodal", openModal)
    }

    function handleArcEdit(ArcID){ 
      setCurrentlyEditing()
      let arc = {...getArcById(ArcID)}
      setCurrentlyEditing(arc)
    }
    
    // Requires GroupColours
    function idToColorClassName(_group_id){ 
      if (_group_id < 0){ // BLANK PADDING ROW
        return "blank"
      } else {
        return group_colors[_group_id%group_colors.length]
      }
    }
    function idToHex(_group_id){ 
      return hex_colors[_group_id%hex_colors.length]
    }
    function idToGroupName(_group_id){ 
      // console.log(_group_id)
      return groups.find((gr) => {return gr.id == _group_id}).title
    }

    /**
     * 
     * @param {Group Object} param0 
     * @returns JSX object containing that group's component to be rendered. 
     */
    function CustomGroupRenderer ({ group }){
      if (group.id < 0){
        return (
        <div class="group_box" >
          <span>{group.title}</span>
        </div>
        );
      } else {
        return (
          <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignContent: 'center', }}>
            <span>{group.title}</span>
            <span>
              <button onClick={(ev) => handleArcEdit(group.id)} style={{height: '100%', padding: '0em', display: 'flex', alignContent: 'center'}}>
                  <box-icon style={{height:'100%'}} name='menu' color="white"></box-icon>
              </button>
            </span>
          </div>
        );
      }
    };

    /**
     * 
     * @param {Params} param0 
     * @returns JSX object containing that group's component to be rendered. 
     */
    function defaultItemRenderer ({
        item,
        itemContext,
        getItemProps,
        getResizeProps
      }) {
      const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
      const color = idToHex(item.group)
      item.itemProps.primaryColor = color

      // if (item.itemProps.tags.length > 0 && !item.itemProps.tags.some(tag => visibleTags.includes(tag))){
      //   return <></>
      // } else {
        return (
          <div {...getItemProps(item.itemProps)}>
            <box-icon class="event_point_marker" name='radio-circle' color={color} ></box-icon>
            <box-icon class="event_point_marker_background" type='solid' name='circle' color={itemContext.selected ? color : '#242424'}></box-icon>
            {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}
            <div
              className="rct-item-content"
              style={{ maxHeight: `${itemContext.dimensions.height}`, position: 'absolute', left: '-4em', top: '-1.5em'}}
            >
              {itemContext.title}
            </div>
            {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
            
            {openModal == item.id ?
            <div style={{position: 'absolute', left: '1em', top: '1.5em'}}>
              <EventCard
                item={item} 
                removeItemById={removeItemById} 
                replaceItem={replaceItem} 
                deselectItem={deselectItem}
              /> 
            </div>
            : ''}
            {/* {openModal == item.id ? <FloatingDescriptionBox item={item}/> : ''} */}
          </div>
        )
      // }

    }
    
    function addNewGroup() {
      const newGroupId = groups.length + 1
      const newGroup = {id: newGroupId, title: "Arc "+newGroupId}
      console.log(newGroup)
      setGroups((prev) => [...prev, newGroup])
    }
    
    function createArrayWithIds(start, end){ // Creates blank groups
      return Array.from({ length: (end - start) + 1 }, (_, i) => ({
        id: start + i,
        title: ''
      }));
    };

    function groupWithPadding(paddingAmount){ // adds negative ID blankspace
      const beforePadding = createArrayWithIds(-paddingAmount, -1)
      const afterPadding = createArrayWithIds(-2*paddingAmount, -paddingAmount-1)
      return [...beforePadding, ... groups, ...afterPadding]
      // return [{id: -1, title: ''}, ... groups, ...afterPadding]
    }

    function exportCSV(){
      console.log("exportingcsv", items)

      let csvContent = "data:text/csv;charset=utf-8,";
      items.forEach(
        function(item) {
          let row = [
            item.id,
            item.title,
            item.group,
            moment.unix(item.start_time/1000).format('YYYY-MM-DD HH:mm:ss'),
            moment.unix(item.end_time/1000).format('YYYY-MM-DD HH:mm:ss'),
            item.itemProps.arcTitle,
            item.itemProps.longDescription,
            ...item.itemProps.tags // unwrap item tags. 
          ].join(",");
          csvContent += row + "\r\n";
      });

      var encodedUri = encodeURI(csvContent);

      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "items.csv"); // specify filename
      document.body.appendChild(link); // Required for Firefox
      
      link.click();
      document.body.removeChild(link); // Clean up
      
    }
    // const [importedCSV, setImportedCSV] = useState(null)

    // function handleCSVInputChange(ev) { 
    //   setImportedCSV(ev.target.files[0])
    // }
    // function importCSV(ev){
    //   ev.preventDefault()
    //   console.log("importingcsv")
    //   console.log(importedCSV)
    //   if (importedCSV){
    //       Papa.parse(importedCSV, {
    //       header: false,
    //       skipEmptyLines: true, 
    //       complete: (result)=>  {
    //         console.log('Parsed CSV Data:', result.data);
    //         importCSVHelper(result.data); // Set parsed data in the state
    //       },
    //       error: (error) => {
    //         console.error('Error parsing CSV file:', error);
    //       }
    //      })
    //   } else {
    //     console.error('No file selected');
    //   }
    // }

    // function importCSVHelper(itemsArray){
    //   let tempGroups = []
    //   let tempItems = []
    //   let maxId = -1
    //   console.log("previtems",items)
    //   itemsArray.forEach((csvLine) => {
    //     // UNPACK VALUES IN CSV LINE
    //     let id = parseInt(csvLine[0])        
    //     let title = csvLine[1]
    //     let groupId = parseInt(csvLine[2])
    //     let startTimeUnix = moment(csvLine[3], 'YYYY-MM-DD HH:mm:ss');
    //     let endTimeObjUnix = moment(csvLine[4], 'YYYY-MM-DD HH:mm:ss');
    //     let arcTitle = csvLine[5]
    //     let longDescription = csvLine[6]
    //     let tags = []
    //     for (let i=6; i < csvLine.length && csvLine[i] != ""; i++){
    //       tags.push(csvLine[i])
    //     }
        
    //     // CREATE GROUPS
    //     let matches = tempGroups.filter((gr) => gr.id == groupId)
    //     if (matches.length == 0){ // add new group
    //       tempGroups.push({id: groupId, title: arcTitle, color: ''})
    //     } else if (matches[0].title != arcTitle) { // error in duplicate group
    //       console.log("UNMATCH", matches[0].title, arcTitle)
    //       console.error("While importing, found two differently named arcs with identical ids", groupId, matches[0].title, arcTitle)
    //     }

    //     // TRACK MAX ID: 
    //     maxId = Math.max(id, maxId)

    //     // CREATE ITEM
    //     const newItem = {
    //       id: id,
    //       title: title,
    //       group: groupId,
    //       start_time: startTimeUnix,
    //       end_time: endTimeObjUnix, 
    //       itemProps: {
    //         style: {
    //           color: "white",
    //           background: '#00000000',
    //           border: '0px'
    //         }, 
    //         arcTitle: arcTitle,
    //         primaryColor: '#00000000',
    //         longDescription: longDescription,
    //         tags: tags
    //       }
    //     }
    //     // ADD ITEM TO TEMP ARRAY
    //     tempItems.push(newItem)
    //   })
    //   console.log("finished importing: ", tempItems, tempGroups)
    //   setItems((prev) => {console.log("setting"); return tempItems;})
    //   setGroups((prev) => {console.log("setting"); return  tempGroups;})
    //   setNextOpenId(maxId+1) // set to max id in items. 
    // }

    const [visibleTags, setVisibleTags] = useState([])

    const handleCheckboxChange = (event) => {
        const { tagName, checked } = event.target;
        if (checked){ 
          setVisibleTags((prev) => ([...prev, tagName]));
        } else {
          setVisibleTags((prev) => (prev.filter(tag => tag !== tagName)));
        }
    };

    return (

       <div>
        {currentlyEditing != null ?
            <EditPopup
              currentlyEditing = {currentlyEditing} 
              setCurrentlyEditing = {setCurrentlyEditing} 
              removeArcById={removeArcById} 
              replaceArc={replaceArc} 
            />
        :
        
        ''
        }

        <div class="timeline_options_box" style={{width: '100%', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <div>
            <button class="add_arc_button" onClick={exportCSV}>
                  <box-icon class="text_icon_left" name='export' color="white"></box-icon>
                  <span>Export Timeline</span>
            </button>    
            <button class="add_arc_button" onClick={(ev) => { ev.preventDefault(); addNewGroup();}}>
                  <box-icon class="text_icon_left" type='solid' name='train' color="white"></box-icon>
                  <span>Create New Arc</span>
            </button>
          </div>
          <div>
            <button class="refresh_tags_button" onClick={(ev) => { ev.preventDefault(); refreshTagList();}}>Refresh TagList</button>
            <div class="tag_list">
                {tagList.map((tag) => {
                    return (
                      <div id={`tag_${tag}`} style={{display:'flex',flexDirection:'row'}}>
                        <input type="checkbox" onChange={handleCheckboxChange} defaultChecked='true'></input>
                        <div class="tag_box" key={tag} >{tag}</div>
                      </div>
                    )
                })}
            </div>
          </div>
        </div>
        <i>Double-click on a line to add an event</i>
        <Timeline
          groups={groupWithPadding(4)}
          items={items}
          defaultTimeStart={moment().add(-12, 'hour')}
          defaultTimeEnd={moment().add(12, 'hour')}
          onCanvasDoubleClick =  {createItem}
          onItemMove={moveItem}
          onItemSelect = {selectItem}
          onItemDeselect = {deselectItem}
          groupRenderer={({ group }) => {return <CustomGroupRenderer group = {group}/>}}
          itemRenderer={defaultItemRenderer}
          horizontalLineClassNamesForGroup={group => {return [idToColorClassName(group.id)]} } // colour based on id.
          lineHeight= '30'
        />
      </div>
      )
}
