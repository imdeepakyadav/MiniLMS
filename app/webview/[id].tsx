import { Button } from "@components/ui/Button";
import { EmptyState } from "@components/ui/EmptyState";
import { Loader } from "@components/ui/Loader";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCourses } from "@features/courses/useCourses";
import { useCourseStore } from "@store/courseStore";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  ICON_SIZE,
  SPACING,
} from "@utils/theme";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView, { WebViewMessageEvent } from "react-native-webview";

export default function WebViewScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const webViewRef = useRef<WebView>(null);
  const { courses, isLoading: courseStoreLoading, dispatch } = useCourseStore();
  const { refetch } = useCourses();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);

  useEffect(() => {
    if (!courses.length) {
      void refetch();
    }
  }, [courses.length, refetch]);

  const course = courses.find((item) => item.id === courseId);

  const htmlContent = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script>
          window.__courseHeaders = window.__courseHeaders || {};
        </script>
        <style>
          :root {
            color-scheme: dark;
            --bg: #0F172A;
            --surface: #1E293B;
            --surface-2: #334155;
            --text: #F8FAFC;
            --muted: #94A3B8;
            --accent: #22C55E;
            --border: #334155;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 24px 16px 32px;
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          .shell {
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 1));
            border: 1px solid var(--border);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
          }

          .hero {
            padding: 20px 20px 18px;
            border-bottom: 1px solid var(--border);
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 10px;
            background: rgba(99, 102, 241, 0.14);
            color: #A5B4FC;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            margin-bottom: 14px;
          }

          h1 {
            margin: 0;
            font-size: 28px;
            line-height: 1.15;
            letter-spacing: -0.02em;
          }

          .instructor {
            margin-top: 8px;
            color: var(--muted);
            font-size: 14px;
          }

          .platform-badge {
            display: inline-flex;
            align-items: center;
            margin-top: 14px;
            padding: 6px 10px;
            border-radius: 999px;
            background: rgba(99, 102, 241, 0.14);
            color: #c7d2fe;
            font-size: 12px;
            font-weight: 700;
          }

          .panel {
            padding: 20px;
          }

          .section-title {
            margin: 0 0 14px;
            font-size: 16px;
            font-weight: 700;
          }

          .lesson-list {
            display: grid;
            gap: 12px;
          }

          .lesson {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            background: rgba(51, 65, 85, 0.55);
            border: 1px solid var(--border);
            border-radius: 16px;
          }

          .checkbox {
            width: 28px;
            height: 28px;
            flex: 0 0 28px;
            border-radius: 8px;
            background: rgba(34, 197, 94, 0.18);
            color: var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
          }

          .lesson-body {
            flex: 1;
            min-width: 0;
          }

          .lesson-name {
            margin: 0 0 4px;
            font-size: 15px;
            font-weight: 700;
          }

          .lesson-duration {
            color: var(--muted);
            font-size: 12px;
          }

          .complete-button {
            width: 100%;
            margin-top: 18px;
            border: none;
            border-radius: 16px;
            padding: 16px 18px;
            background: var(--accent);
            color: #052e16;
            font-size: 15px;
            font-weight: 800;
            text-align: center;
          }
        </style>
        <script>
          window.__courseData = null;

          window.addEventListener('message', function(event) {
            try {
              var data = JSON.parse(event.data);
              if (data.type === 'COURSE_DATA') {
                window.__courseData = data.payload;
                document.getElementById('course-title').innerText = data.payload.title;
                document.getElementById('instructor-name').innerText = 'by ' + data.payload.instructor;
              }
            } catch {
            }
          });

          function markComplete() {
            var courseData = window.__courseData;
            if (!courseData) {
              return;
            }

            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'COURSE_COMPLETED',
              courseId: courseData.courseId
            }));
          }
        </script>
      </head>
      <body>
        <div class="shell">
          <div class="hero">
            <div class="eyebrow">Course Content</div>
            <h1 id="course-title">Course Title</h1>
            <div class="instructor" id="instructor-name">by Instructor</div>
            <div class="platform-badge" id="platform-badge">Viewing on web</div>
          </div>

          <div class="panel">
            <div class="section-title">Lessons</div>
            <div class="lesson-list">
              <div class="lesson">
                <div class="checkbox">✓</div>
                <div class="lesson-body">
                  <div class="lesson-name">Introduction</div>
                  <div class="lesson-duration">5 min</div>
                </div>
              </div>
              <div class="lesson">
                <div class="checkbox">✓</div>
                <div class="lesson-body">
                  <div class="lesson-name">Core Concepts</div>
                  <div class="lesson-duration">12 min</div>
                </div>
              </div>
              <div class="lesson">
                <div class="checkbox">✓</div>
                <div class="lesson-body">
                  <div class="lesson-name">Hands-on Practice</div>
                  <div class="lesson-duration">18 min</div>
                </div>
              </div>
              <div class="lesson">
                <div class="checkbox">✓</div>
                <div class="lesson-body">
                  <div class="lesson-name">Advanced Techniques</div>
                  <div class="lesson-duration">20 min</div>
                </div>
              </div>
              <div class="lesson">
                <div class="checkbox">✓</div>
                <div class="lesson-body">
                  <div class="lesson-name">Final Assessment</div>
                  <div class="lesson-duration">10 min</div>
                </div>
              </div>
            </div>

            <button class="complete-button" onclick="markComplete()">Mark as Complete</button>
          </div>
        </div>
      </body>
      </html>
      `;
  }, []);

  const webViewHeaders = useMemo(
    () => ({
      "X-Course-Id": course?.id ?? "",
      "X-Course-Title": encodeURIComponent(course?.title ?? ""),
      "X-Instructor": encodeURIComponent(course?.instructorName ?? ""),
      "X-App-Version": "1.0.0",
      "X-Platform": Platform.OS,
    }),
    [course?.id, course?.instructorName, course?.title],
  );

  const WebViewComponent = WebView as unknown as React.ComponentType<any>;

  const sendCourseData = () => {
    if (!course) {
      return;
    }

    const payload = {
      type: "COURSE_DATA",
      payload: {
        courseId: course.id,
        title: course.title,
        instructor: course.instructorName,
      },
    };

    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: ${JSON.stringify(JSON.stringify(payload))}
      }));
      true;
    `);
  };

  const injectCourseHeaders = () => {
    if (!course) {
      return;
    }

    // react-native-webview does not expose request headers directly to JS,
    // so we intentionally send metadata both as headers and via injected JS.
    webViewRef.current?.injectJavaScript(`
      window.__courseHeaders = {
        courseId: ${JSON.stringify(course.id)},
        title: ${JSON.stringify(course.title)},
        instructor: ${JSON.stringify(course.instructorName)},
        platform: ${JSON.stringify(Platform.OS)}
      };
      document.getElementById('platform-badge').innerText =
        'Viewing on ' + window.__courseHeaders.platform;
      true;
    `);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "COURSE_COMPLETED") {
        dispatch({
          type: "ENROLL_COURSE",
          payload: data.courseId ?? course?.id ?? "",
        });
        Alert.alert("Course Completed! 🎉", "You have completed this course.", [
          { text: "OK" },
        ]);
      }
    } catch {}
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setWebViewKey((value) => value + 1);
  };

  if (!course && courseStoreLoading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Course Content",
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.textPrimary,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={ICON_SIZE.md}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingWrapper}>
          <Loader />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Course Content",
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.textPrimary,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={ICON_SIZE.md}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <EmptyState
          icon="alert-circle-outline"
          title="Failed to load course content"
          subtitle={error ?? "Please retry or go back to the course."}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Course Content",
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.textPrimary,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons
                name="arrow-back"
                size={ICON_SIZE.md}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.webViewContainer}>
        <WebViewComponent
          key={webViewKey}
          ref={webViewRef}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => {
            setLoading(false);
            injectCourseHeaders();
            sendCourseData();
          }}
          onMessage={handleMessage}
          onError={(syntheticEvent: any) => {
            setError(
              syntheticEvent.nativeEvent.description ??
                "Failed to load course content",
            );
            setLoading(false);
          }}
          headers={webViewHeaders}
          originWhitelist={["*"]}
          style={styles.webView}
        />

        {loading ? (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <Loader />
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorOverlay}>
            <Ionicons
              name="alert-circle-outline"
              size={ICON_SIZE.xxl}
              color={COLORS.primary}
              style={styles.errorIcon}
            />
            <Text style={styles.errorTitle}>Failed to load course content</Text>
            <Text style={styles.errorDescription}>{error}</Text>
            <Button label="Retry" onPress={handleRetry} variant="primary" />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.42)",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  errorIcon: {
    marginBottom: SPACING.md,
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  errorDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginBottom: SPACING.lg,
    maxWidth: 320,
  },
});
