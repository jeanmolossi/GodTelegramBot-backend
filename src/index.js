import 'dotenv/config';
import app from './app';

app.listen(process.env.PORT || 3333, () => {
  console.log('Listening express: ', process.env.PORT);
});
