import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const { CohereClientV2 } = require('cohere-ai');
const cohere = new CohereClientV2({
  token: '<<apiKey>>',
});
(async () => {
  const response = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [
      {
        role: 'user',
        content: 'hello world!',
      },
    ],
  });
  console.log(response);
})();




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatBot_Hackaton';

  
}
