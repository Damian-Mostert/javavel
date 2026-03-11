import { Controller, Req, Res } from "@/vendor/http";
    
export default class testController extends Controller {
    use = [];
    async someMethod(req: Req, res: Res) {
        return res.json({
            message: "Hello world"
        });
    }
}