// vite.config.dev.ts
import { defineConfig, loadConfigFromFile } from "file:///data/shadcn/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.7_terser@5.46.0/node_modules/vite/dist/node/index.js";
import path from "path";
import {
  makeTagger,
  injectedGuiListenerPlugin,
  injectOnErrorPlugin,
  monitorPlugin
} from "file:///data/shadcn/node_modules/.pnpm/miaoda-sc-plugin@1.0.52_vite@5.4.21_@types+node@22.19.7_terser@5.46.0_/node_modules/miaoda-sc-plugin/dist/index.js";
var __vite_injected_original_dirname = "/workspace/app-93vxdy5v8bnl";
var env = { command: "serve", mode: "development" };
var configFile = path.resolve(__vite_injected_original_dirname, "vite.config.ts");
var result = await loadConfigFromFile(env, configFile);
var userConfig = result?.config;
var vite_config_dev_default = defineConfig({
  ...userConfig,
  plugins: [
    makeTagger(),
    injectedGuiListenerPlugin({
      path: "https://resource-static.cdn.bcebos.com/common/v2/injected.js"
    }),
    injectOnErrorPlugin(),
    ...userConfig?.plugins || [],
    {
      name: "hmr-toggle",
      configureServer(server) {
        let hmrEnabled = true;
        const _send = server.ws.send;
        server.ws.send = (payload) => {
          if (hmrEnabled) {
            return _send.call(server.ws, payload);
          } else {
            console.log("[HMR disabled] skipped payload:", payload.type);
          }
        };
        server.middlewares.use("/innerapi/v1/sourcecode/__hmr_off", (req, res) => {
          hmrEnabled = false;
          let body = {
            status: 0,
            msg: "HMR disabled"
          };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        });
        server.middlewares.use("/innerapi/v1/sourcecode/__hmr_on", (req, res) => {
          hmrEnabled = true;
          let body = {
            status: 0,
            msg: "HMR enabled"
          };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        });
        server.middlewares.use("/innerapi/v1/sourcecode/__hmr_reload", (req, res) => {
          if (hmrEnabled) {
            server.ws.send({
              type: "full-reload",
              path: "*"
              // 整页刷新
            });
          }
          res.statusCode = 200;
          let body = {
            status: 0,
            msg: "Manual full reload triggered"
          };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        });
      },
      load(id) {
        if (id === "virtual:after-update") {
          return `
        if (import.meta.hot) {
          import.meta.hot.on('vite:afterUpdate', () => {
            window.postMessage(
              {
                type: 'editor-update'
              },
              '*'
            );
          });
        }
      `;
        }
      },
      transformIndexHtml(html) {
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                type: "module",
                src: "/@id/virtual:after-update"
              },
              injectTo: "body"
            }
          ]
        };
      }
    },
    ,
    monitorPlugin(
      {
        scriptSrc: "https://resource-static.cdn.bcebos.com/sentry/browser.sentry.min.js",
        sentryDsn: "https://e3c07b90fcb5207f333d50ac24a99d3e@sentry.miaoda.cn/233",
        environment: "undefined",
        appId: "app-93vxdy5v8bnl"
      }
    )
  ]
});
export {
  vite_config_dev_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuZGV2LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZS9hcHAtOTN2eGR5NXY4Ym5sXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlL2FwcC05M3Z4ZHk1djhibmwvdml0ZS5jb25maWcuZGV2LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2UvYXBwLTkzdnhkeTV2OGJubC92aXRlLmNvbmZpZy5kZXYudHNcIjtcbiAgICBpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRDb25maWdGcm9tRmlsZSB9IGZyb20gXCJ2aXRlXCI7XG4gICAgaW1wb3J0IHR5cGUgeyBQbHVnaW4sIENvbmZpZ0VudiB9IGZyb20gXCJ2aXRlXCI7XG4gICAgaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuICAgIGltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSBcImF1dG9wcmVmaXhlclwiO1xuICAgIGltcG9ydCBmcyBmcm9tIFwiZnMvcHJvbWlzZXNcIjtcbiAgICBpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuICAgIGltcG9ydCB7XG4gICAgICBtYWtlVGFnZ2VyLFxuICAgICAgaW5qZWN0ZWRHdWlMaXN0ZW5lclBsdWdpbixcbiAgICAgIGluamVjdE9uRXJyb3JQbHVnaW4sXG4gICAgICBtb25pdG9yUGx1Z2luXG4gICAgfSBmcm9tIFwibWlhb2RhLXNjLXBsdWdpblwiO1xuXG4gICAgY29uc3QgZW52OiBDb25maWdFbnYgPSB7IGNvbW1hbmQ6IFwic2VydmVcIiwgbW9kZTogXCJkZXZlbG9wbWVudFwiIH07XG4gICAgY29uc3QgY29uZmlnRmlsZSA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwidml0ZS5jb25maWcudHNcIik7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbG9hZENvbmZpZ0Zyb21GaWxlKGVudiwgY29uZmlnRmlsZSk7XG4gICAgY29uc3QgdXNlckNvbmZpZyA9IHJlc3VsdD8uY29uZmlnO1xuXG4gICAgZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICAgIC4uLnVzZXJDb25maWcsXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIG1ha2VUYWdnZXIoKSxcbiAgICAgICAgaW5qZWN0ZWRHdWlMaXN0ZW5lclBsdWdpbih7XG4gICAgICAgICAgcGF0aDogJ2h0dHBzOi8vcmVzb3VyY2Utc3RhdGljLmNkbi5iY2Vib3MuY29tL2NvbW1vbi92Mi9pbmplY3RlZC5qcydcbiAgICAgICAgfSksXG4gICAgICAgIGluamVjdE9uRXJyb3JQbHVnaW4oKSxcbiAgICAgICAgLi4uKHVzZXJDb25maWc/LnBsdWdpbnMgfHwgW10pLFxuICAgICAgICBcbntcbiAgbmFtZTogJ2htci10b2dnbGUnLFxuICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgbGV0IGhtckVuYWJsZWQgPSB0cnVlO1xuXG4gICAgLy8gXHU1MzA1XHU4OEM1XHU1MzlGXHU2NzY1XHU3Njg0IHNlbmQgXHU2NUI5XHU2Q0Q1XG4gICAgY29uc3QgX3NlbmQgPSBzZXJ2ZXIud3Muc2VuZDtcbiAgICBzZXJ2ZXIud3Muc2VuZCA9IChwYXlsb2FkKSA9PiB7XG4gICAgICBpZiAoaG1yRW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gX3NlbmQuY2FsbChzZXJ2ZXIud3MsIHBheWxvYWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tITVIgZGlzYWJsZWRdIHNraXBwZWQgcGF5bG9hZDonLCBwYXlsb2FkLnR5cGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBcdTYzRDBcdTRGOUJcdTYzQTVcdTUzRTNcdTUyMDdcdTYzNjIgSE1SXG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2lubmVyYXBpL3YxL3NvdXJjZWNvZGUvX19obXJfb2ZmJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBobXJFbmFibGVkID0gZmFsc2U7XG4gICAgICBsZXQgYm9keSA9IHtcbiAgICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgICAgbXNnOiAnSE1SIGRpc2FibGVkJ1xuICAgICAgfTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGJvZHkpKTtcbiAgICB9KTtcblxuICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9pbm5lcmFwaS92MS9zb3VyY2Vjb2RlL19faG1yX29uJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBobXJFbmFibGVkID0gdHJ1ZTtcbiAgICAgIGxldCBib2R5ID0ge1xuICAgICAgICAgIHN0YXR1czogMCxcbiAgICAgICAgICBtc2c6ICdITVIgZW5hYmxlZCdcbiAgICAgIH07XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShib2R5KSk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTZDRThcdTUxOENcdTRFMDBcdTRFMkEgSFRUUCBBUElcdUZGMENcdTc1MjhcdTY3NjVcdTYyNEJcdTUyQThcdTg5RTZcdTUzRDFcdTRFMDBcdTZCMjFcdTY1NzRcdTRGNTNcdTUyMzdcdTY1QjBcbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvaW5uZXJhcGkvdjEvc291cmNlY29kZS9fX2htcl9yZWxvYWQnLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGlmIChobXJFbmFibGVkKSB7XG4gICAgICAgIHNlcnZlci53cy5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnZnVsbC1yZWxvYWQnLFxuICAgICAgICAgIHBhdGg6ICcqJywgLy8gXHU2NTc0XHU5ODc1XHU1MjM3XHU2NUIwXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICBsZXQgYm9keSA9IHtcbiAgICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgICAgbXNnOiAnTWFudWFsIGZ1bGwgcmVsb2FkIHRyaWdnZXJlZCdcbiAgICAgIH07XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShib2R5KSk7XG4gICAgfSk7XG4gIH0sXG4gIGxvYWQoaWQpIHtcbiAgICBpZiAoaWQgPT09ICd2aXJ0dWFsOmFmdGVyLXVwZGF0ZScpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIGlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgICAgICAgICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YWZ0ZXJVcGRhdGUnLCAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZWRpdG9yLXVwZGF0ZSdcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJyonXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbCxcbiAgICAgIHRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgICAgICAgc3JjOiAnL0BpZC92aXJ0dWFsOmFmdGVyLXVwZGF0ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGluamVjdFRvOiAnYm9keSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn0sXG4sXG4gICAgICAgIG1vbml0b3JQbHVnaW4oXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NyaXB0U3JjOiAnaHR0cHM6Ly9yZXNvdXJjZS1zdGF0aWMuY2RuLmJjZWJvcy5jb20vc2VudHJ5L2Jyb3dzZXIuc2VudHJ5Lm1pbi5qcycsXG4gICAgICAgICAgICBzZW50cnlEc246ICdodHRwczovL2UzYzA3YjkwZmNiNTIwN2YzMzNkNTBhYzI0YTk5ZDNlQHNlbnRyeS5taWFvZGEuY24vMjMzJyxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiAndW5kZWZpbmVkJyxcbiAgICAgICAgICAgIGFwcElkOiAnYXBwLTkzdnhkeTV2OGJubCdcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIF1cbiAgICB9KTtcbiAgICAiXSwKICAibWFwcGluZ3MiOiAiO0FBQ0ksU0FBUyxjQUFjLDBCQUEwQjtBQUtqRCxPQUFPLFVBQVU7QUFDakI7QUFBQSxFQUNFO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsT0FDSztBQVpYLElBQU0sbUNBQW1DO0FBY3JDLElBQU0sTUFBaUIsRUFBRSxTQUFTLFNBQVMsTUFBTSxjQUFjO0FBQy9ELElBQU0sYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQzNELElBQU0sU0FBUyxNQUFNLG1CQUFtQixLQUFLLFVBQVU7QUFDdkQsSUFBTSxhQUFhLFFBQVE7QUFFM0IsSUFBTywwQkFBUSxhQUFhO0FBQUEsRUFDMUIsR0FBRztBQUFBLEVBQ0gsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsMEJBQTBCO0FBQUEsTUFDeEIsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBLElBQ0Qsb0JBQW9CO0FBQUEsSUFDcEIsR0FBSSxZQUFZLFdBQVcsQ0FBQztBQUFBLElBRXBDO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsUUFBUTtBQUN0QixZQUFJLGFBQWE7QUFHakIsY0FBTSxRQUFRLE9BQU8sR0FBRztBQUN4QixlQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVk7QUFDNUIsY0FBSSxZQUFZO0FBQ2QsbUJBQU8sTUFBTSxLQUFLLE9BQU8sSUFBSSxPQUFPO0FBQUEsVUFDdEMsT0FBTztBQUNMLG9CQUFRLElBQUksbUNBQW1DLFFBQVEsSUFBSTtBQUFBLFVBQzdEO0FBQUEsUUFDRjtBQUdBLGVBQU8sWUFBWSxJQUFJLHFDQUFxQyxDQUFDLEtBQUssUUFBUTtBQUN4RSx1QkFBYTtBQUNiLGNBQUksT0FBTztBQUFBLFlBQ1AsUUFBUTtBQUFBLFlBQ1IsS0FBSztBQUFBLFVBQ1Q7QUFDQSxjQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxjQUFJLElBQUksS0FBSyxVQUFVLElBQUksQ0FBQztBQUFBLFFBQzlCLENBQUM7QUFFRCxlQUFPLFlBQVksSUFBSSxvQ0FBb0MsQ0FBQyxLQUFLLFFBQVE7QUFDdkUsdUJBQWE7QUFDYixjQUFJLE9BQU87QUFBQSxZQUNQLFFBQVE7QUFBQSxZQUNSLEtBQUs7QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsY0FBSSxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxRQUM5QixDQUFDO0FBR0QsZUFBTyxZQUFZLElBQUksd0NBQXdDLENBQUMsS0FBSyxRQUFRO0FBQzNFLGNBQUksWUFBWTtBQUNkLG1CQUFPLEdBQUcsS0FBSztBQUFBLGNBQ2IsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBO0FBQUEsWUFDUixDQUFDO0FBQUEsVUFDSDtBQUNBLGNBQUksYUFBYTtBQUNqQixjQUFJLE9BQU87QUFBQSxZQUNQLFFBQVE7QUFBQSxZQUNSLEtBQUs7QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsY0FBSSxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxRQUM5QixDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsS0FBSyxJQUFJO0FBQ1AsWUFBSSxPQUFPLHdCQUF3QjtBQUNqQyxpQkFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVlUO0FBQUEsTUFDRjtBQUFBLE1BQ0EsbUJBQW1CLE1BQU07QUFDdkIsZUFBTztBQUFBLFVBQ0w7QUFBQSxVQUNBLE1BQU07QUFBQSxZQUNKO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsZ0JBQ0wsTUFBTTtBQUFBLGdCQUNOLEtBQUs7QUFBQSxjQUNQO0FBQUEsY0FDQSxVQUFVO0FBQUEsWUFDWjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBO0FBQUEsSUFDUTtBQUFBLE1BQ0U7QUFBQSxRQUNFLFdBQVc7QUFBQSxRQUNYLFdBQVc7QUFBQSxRQUNYLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
