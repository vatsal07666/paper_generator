import React from 'react';
import { Box, Typography, List, ListItem, Divider, Paper } from '@mui/material';

const QuestionPreview = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" mb={2} align="center">
        Preview of Question Paper
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <List>
          {questions.map((q, index) => (
            <React.Fragment key={q.id}>
              <ListItem alignItems="flex-start">
                <Typography variant="body1">
                  {index + 1}. {q.text}
                </Typography>
              </ListItem>
              {index < questions.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default QuestionPreview;