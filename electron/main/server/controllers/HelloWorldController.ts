import { Get, Route, Controller } from 'tsoa';

@Route('hello')
export class HelloWorldController extends Controller {

    @Get()
    public async sayHello(): Promise<{ message: string }> {
        return {
            message: "Hello World!"
        };
    }
}
