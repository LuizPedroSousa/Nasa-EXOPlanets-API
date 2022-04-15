import 'express-async-errors';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import express, { Express } from 'express';
import { limiter } from '@config/limiter';
import { cors } from '@config/cors';
import { routes } from './routes';
import { exceptionHandler } from './middlewares/ExceptionHandler';

class Main {
  constructor(public env: DotenvConfigOutput = dotenv.config(), public app: Express = express()) {}

  public init() {
    this.middlewares();
    this.routes();
    this.exceptions();
  }

  private middlewares() {
    this.app.set('trust proxy', 1);

    this.app.use(limiter);

    this.app.use(cors);

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(express.static('public'));
  }

  private routes() {
    this.app.use(routes);
  }

  private exceptions(): void {
    this.app.use(exceptionHandler.handle);
  }

  public listen(): void {
    this.app.listen(process.env.PORT || 3336, () => {
      console.log(
        `--- Server at one small step to the moon on port ${process.env.PORT || 3336} 🚀---

                                      ░░░░░░░░░░                                        
                                  ░░░░          ░░                                      
                              ░░░░            ░░                                        
                            ░░              ░░                                          
                          ░░              ░░      ██      ██                            
                        ░░              ░░        ██████████                            
                        ░░              ░░      ██████████████                          
                      ░░              ░░        ██████████████                          
                      ░░              ░░          ██████████                            
                      ░░            ░░              ██████                              
                    ░░              ░░                ██                                
                    ░░              ░░              ██████                              
                    ░░              ░░            ██████████                            
                    ░░              ░░            ██████████                            
                    ░░                ░░          ██████████                            
                      ░░              ░░      ██████████████████                        
                      ░░                ░░  ██████████████████████  ░░                  
                      ░░                  ░░██████████████████████░░░░                  
                        ░░                  ░░██████████████████░░  ░░                  
                        ░░                    ░░░░██████████░░░░    ░░                  
                          ░░                      ░░░░░░░░░░        ░░                  
                            ░░                                    ░░                    
                              ░░                              ░░░░                      
                                ░░░░                      ░░░░                          
                                    ░░░░░░          ░░░░░░██                            
                                          ░░░░░░░░░░    ████                            
                                                      ████                              
      `,
      );
    });
  }
}

export const main = new Main();
