import HttpKernel from "@/app/Http/Kernel";
import CommandKernel from "@/app/Console/Kernel";
export default function LoadEnviroment() {
  return {
    HttpKernel,
    CommandKernel,
  };
}
