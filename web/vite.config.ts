import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/everyoneknows/", // 配置 GitHub Pages 的仓库子目录
});
