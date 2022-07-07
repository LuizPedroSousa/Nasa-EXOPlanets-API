import http from 'http';
import { main } from './main';

class Server {
  private server;
  private port: number;

  constructor() {
    main.init();

    this.server = http.createServer(main.app);
    this.port = Number(process.env.PORT) || 3336;
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(
        `--- Server at one small step to the moon on port ${this.port} 🚀---

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

const server = new Server();

server.listen();
