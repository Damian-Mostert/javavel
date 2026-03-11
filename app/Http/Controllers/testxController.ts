import { Controller, Req, Res } from "@/vendor/http";
    
export default class testxController extends Controller {
    use = [];
    async someMethod(req: Req, res: Res) {
        return res.json({
            message: "Hello world"
        });
    }
}