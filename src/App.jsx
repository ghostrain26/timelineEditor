import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TimelineDisplay from './TimelineDisplay.jsx'
import moment from 'moment'
import Papa from 'papaparse'

function App() {
  // const sampleGroups = [
  //   { id: 1, title: 'Arc 1', color: 'maroon'},
  //   { id: 2, title: 'Arc 2', color: 'red'},
  //   { id: 3, title: 'Arc 3', color: 'red'},
  //   { id: 4, title: 'Arc 4', color: 'red'},
  // ]
  // const sampleItems = [
  //   {
  //     id: 1,
  //     group: 1,
  //     title: 'Default 1',
  //     start_time: moment(),
  //     end_time: moment().add(.25, 'hour'),
  //     itemProps: {
  //       style: {
  //         background: '#00000000',
  //         border: '0px'
  //       },
  //       arcTitle: 'Arc 1',
  //       primaryColor: '#00000000',
  //       longDescription: "This is a long item description",
  //       tags: ["Character B", "Setting X", "Romance"]
  //     }
  //   },
  //   {
  //     id: 2,
  //     group: 2,
  //     title: 'Default 2',
  //     start_time: moment().add(0.5, 'hour'),
  //     end_time: moment().add(0.75, 'hour'),
  //     itemProps: {
  //       style: {
  //         background: '#00000000',
  //         border: '0px', 
  //       },
  //       arcTitle: 'Arc 2',
  //       primaryColor: '#00000000',
  //       longDescription: "This is a long item description",
  //       tags: ["Character B", "Setting X", "Action"]
  //     }
  //   },
  //   {
  //     id: 3,
  //     group: 1,
  //     title: 'Default 3',
  //     start_time: moment().add(2, 'hour'),
  //     end_time: moment().add(2.25, 'hour'),
  //     itemProps: {
  //       style: {
  //         background: '#00000000',
  //         border: '0px'
  //       },
  //       arcTitle: 'Arc 1',
  //       primaryColor: '#00000000',
  //       longDescription: "This is a long item description",
  //       tags: ["Character A", "Setting Y", "Romance"]
  //     }
  //   }, 
  // ]

  // IMPORT FUNCTIONS

  const [importedCSV, setImportedCSV] = useState(null)
  const [initialGroups, setInitialGroups] = useState([])
  const [initialItems, setInitialItems] = useState([])
  const [initialId, setInitialId] = useState(0)

  function handleCSVInputChange(ev) { 
    setImportedCSV(ev.target.files[0])
  }

    function importCSV(ev){
      ev.preventDefault()
      console.log("importingcsv")
      console.log(importedCSV)
      if (importedCSV){
          Papa.parse(importedCSV, {
          header: false,
          skipEmptyLines: true, 
          complete: (result)=>  {
            console.log('Parsed CSV Data:', result.data);
            importCSVHelper(result.data); // Set parsed data in the state
          },
          error: (error) => {
            console.error('Error parsing CSV file:', error);
          }
         })
      } else {
        console.error('No file selected');
      }
    }

    function importCSVHelper(itemsArray){
      let tempGroups = []
      let tempItems = []
      let maxId = -1
      itemsArray.forEach((csvLine) => {
        // UNPACK VALUES IN CSV LINE
        let id = parseInt(csvLine[0])        
        let title = csvLine[1]
        let groupId = parseInt(csvLine[2])
        let startTimeUnix = moment(csvLine[3], 'YYYY-MM-DD HH:mm:ss').unix()*1000;
        let endTimeUnix = moment(csvLine[4], 'YYYY-MM-DD HH:mm:ss').unix()*1000;
        let arcTitle = csvLine[5]
        let longDescription = csvLine[6]
        let tags = []
        for (let i=7; i < csvLine.length && csvLine[i] != ""; i++){
          tags.push(csvLine[i])
        }
        
        // CREATE GROUPS
        let matches = tempGroups.filter((gr) => gr.id == groupId)
        if (matches.length == 0){ // add new group
          tempGroups.push({id: groupId, title: arcTitle, color: ''})
        } else if (matches[0].title != arcTitle) { // error in duplicate group
          console.log("UNMATCH", matches[0].title, arcTitle)
          console.error("While importing, found two differently named arcs with identical ids", groupId, matches[0].title, arcTitle)
        }

        // TRACK MAX ID: 
        maxId = Math.max(id, maxId)
        // CREATE ITEM
        const newItem = {
          id: id,
          title: title,
          group: groupId,
          start_time: startTimeUnix,
          end_time: endTimeUnix, 
          itemProps: {
            style: {
              color: "white",
              background: '#00000000',
              border: '0px'
            }, 
            arcTitle: arcTitle,
            primaryColor: '#00000000',
            longDescription: longDescription,
            tags: tags
          }
        }
        // ADD ITEM TO TEMP ARRAY
        tempItems.push(newItem)
      })
      console.log("finished importing: ", tempItems, tempGroups)
      setInitialItems((prev) => {console.log("setting"); return tempItems;})
      setInitialGroups((prev) => {console.log("setting"); return tempGroups;})
      setInitialId(maxId+1) // set to max id in items. 
    }


  return (
    <div>
      <form onSubmit={importCSV}>
        <input type='file' accept='.csv' onChange={handleCSVInputChange}/>
        <button class="add_arc_button" type="submit">
              <box-icon class="text_icon_left" name='import' color="white"></box-icon>
              <span>Import Timeline</span>
        </button>   
      </form>   

    <TimelineDisplay
    initialGroups={initialGroups}
    initialItems={initialItems}
    initialId={initialId}

    // editedItem = {editedItem} 
    // setEditedItem = {setEditedItem} 
    // editPopupOpen ={editPopupOpen} 
    // setEditPopupOpen={setEditPopupOpen} 
    />
    </div>
  )
}

export default App
