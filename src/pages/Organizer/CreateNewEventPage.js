import React, {useState}from "react";
import { 
  Paper, 
  Button, 
  Box, 
  Typography,
  IconButton,
  TextField,
  Grid } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Link } from "react-router-dom";

const styles = {
  paperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px', // Adjust the height as needed
    width:'300px' ,
    border: '1px dashed grey',
    borderRadius: 4,
    backgroundColor: '#fafafa',
    marginTop: '16px', // For spacing above the container
  },
  icon: {
    fontSize: '2.5rem', // Adjust the size as needed
    color: 'grey'
  }
};

const CreateNewEventPage = () => {
  const [fileName, setFileName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({
    Concert: false,
    Live: false,
    Comedy: false,
    Opera: false,
  });
  const [seatTypes, setSeatTypes] = useState([{ type: '', price: '' }]);

  const handleFileChange = (event) => {
    // Assuming you want to store the file name in the state
    const file = event.target.files[0];
    setFileName(file ? file.name : '');
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prevState => ({
      [category]: !prevState[category]
    }));
  };
  const handleTypeChange = (index, event) => {
    const newSeatTypes = [...seatTypes];
    newSeatTypes[index].type = event.target.value;
    setSeatTypes(newSeatTypes);
  };

  const handlePriceChange = (index, event) => {
    const newSeatTypes = [...seatTypes];
    newSeatTypes[index].price = event.target.value;
    setSeatTypes(newSeatTypes);
  };

  const addSeatType = () => {
    setSeatTypes([...seatTypes, { type: '', price: '' }]);
  };

  const removeSeatType = index => {
    const newSeatTypes = [...seatTypes];
    newSeatTypes.splice(index, 1);
    setSeatTypes(newSeatTypes);
  };

  // You can use this function to send the data to your backend or store it as needed
  const submitCategories = () => {
    const schema = {
      categories: Object.keys(selectedCategories).filter(category => selectedCategories[category]),
      // Include other information in the schema as needed
    };
    
    console.log(schema);
    // Send `schema` to your backend or store it
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        mb: 2
      }}
    >
      <Typography variant="h6">New Event Information</Typography>
      {/* Add your form fields */}
      <TextField
        label="Event Name"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Event date"
        variant="outlined"
        type="date"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Event Description"
        variant="outlined"
        multiline
        rows={4} // Adjust the number of rows as needed
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Event Address"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Event Official Site Link"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <Typography variant="h8">Relevant Document</Typography>
      <Paper style={styles.paperContainer} elevation={0} variant="outlined" > 
        <CloudUploadIcon style={styles.icon} />
      </Paper>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Upload File
        <input
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {fileName && <TextField fullWidth disabled value={fileName} />}
      {Object.keys(selectedCategories).map((category) => (
        <Button
          key={category}
          variant={selectedCategories[category] ? "contained" : "outlined"}
          onClick={() => toggleCategory(category)}
          sx={{ margin: '8px' }} // Adds spacing between buttons
        >
          {category}
        </Button>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={submitCategories}
        sx={{ marginTop: '16px' }} // Adds space above the submit button
      >
        Submit Selection
      </Button>
      <TextField
        label="Ticket Amount"
        variant="outlined"
        type="number"
        sx={{ mb: 2, width: "300px" }}
      />
      {seatTypes.map((seat, index) => (
      <Box key={index} display="flex" alignItems="center" gap={2} marginBottom={2}>
        <TextField
          label="Seat area type"
          variant="outlined"
          value={seat.type}
          onChange={event => handleTypeChange(index, event)}
          fullWidth
        />
        <TextField
          label="Seat price"
          variant="outlined"
          value={seat.price}
          onChange={event => handlePriceChange(index, event)}
          fullWidth
        />
        {seatTypes.length > 1 && (
          <IconButton onClick={() => removeSeatType(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
        </Box>
      ))}
      <IconButton onClick={addSeatType}>
        <AddCircleOutlineIcon />
      </IconButton>
      {/* Add more fields as necessary */}
      <TextField
        label="Ticket Selling Last Date"
        variant="outlined"
        type="datetime-local"
        sx={{ mb: 2, width: "300px" }}
      />
      <Link to="/Org_Acc">
      <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
       Add New Event
      </Button>
      </Link>
    </Box>
  );
};

export default CreateNewEventPage;


