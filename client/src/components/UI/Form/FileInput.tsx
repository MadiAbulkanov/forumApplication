import { Button, Grid, TextField, styled } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';

interface Props {
  name: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const HiddenInputFile = styled('input')({ display: 'none' });

export default function FileInput({ name, label, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const activeInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
    onChange(e);
  };

  return (
    <>
      <HiddenInputFile type="file" name={name} onChange={onFileChange} ref={inputRef} />
      <Grid container direction={'row'} spacing={2} alignItems={'center'} width="370px">
        <Grid item xs>
          <TextField variant="outlined" fullWidth label={label} value={fileName} disabled onClick={activeInput} />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={activeInput}>
            Browse
          </Button>
        </Grid>
      </Grid>
    </>
  );
}