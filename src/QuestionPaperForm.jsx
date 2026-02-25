import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { Box, MenuItem, Select, InputLabel, FormControl, Checkbox, FormGroup, FormControlLabel, Button, 
  Typography 
} from '@mui/material';
import QuestionPreview from './QuestionPaperPreview';

const QuestionPaperForm = () => {
  const languages = useSelector(state => state.languageStore);
  const topics = useSelector(state => state.topicStore);
  const questions = useSelector(state => state.questionStore);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    if(selectedSubject){
      setAvailableTopics(topics[selectedSubject] || []);
    } else {
      setAvailableTopics([]);
    }
    setSelectedQuestions([]);
  }, [selectedSubject, topics]);

  const handleQuestionSelection = (question, checked) => {
    if(checked){
      setSelectedQuestions([...selectedQuestions, question]);
    } else {
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
    }
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Question Paper Generator</Typography>
      
      <Formik
        initialValues={{ languageName: '', topics: [] }}
        onSubmit={(values) => {
          alert('Question Paper Generated! Check preview below.');
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Subject Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={values.languageName}
                onChange={(e) => {
                  setFieldValue('subject', e.target.value);
                  setSelectedSubject(e.target.value);
                }}
              >
                {languages.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Topics Selection */}
            {availableTopics.length > 0 && (
              <FormControl component="fieldset" margin="normal">
                <Typography variant="subtitle1">Select Topics:</Typography>
                <FormGroup>
                  {availableTopics.map(topic => (
                    <FormControlLabel
                      key={topic.id}
                      control={
                        <Checkbox
                          checked={values.topics.includes(topic.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newTopics;
                            if(checked){
                              newTopics = [...values.topics, topic.id];
                            } else {
                              newTopics = values.topics.filter(t => t !== topic.id);
                            }
                            setFieldValue('topics', newTopics);
                          }}
                        />
                      }
                      label={topic.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            )}

            {/* Questions Selection */}
            {values.topics.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1">Select Questions:</Typography>
                {values.topics.map(topicId => (
                  <Box key={topicId} ml={2} mt={1}>
                    {questions[topicId]?.map(q => (
                      <FormControlLabel
                        key={q.id}
                        control={
                          <Checkbox
                            checked={selectedQuestions.some(sq => sq.id === q.id)}
                            onChange={(e) => handleQuestionSelection(q, e.target.checked)}
                          />
                        }
                        label={q.text}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
            )}

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Generate Question Paper
            </Button>
          </Form>
        )}
      </Formik>

      {/* Preview */}
      {selectedQuestions.length > 0 && (
        <QuestionPreview questions={selectedQuestions} />
      )}
    </Box>
  );
}

export default QuestionPaperForm;