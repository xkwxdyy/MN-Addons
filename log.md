-------------------------------------
Translated Report (Full Report Below)
-------------------------------------

Process:               MarginNote 4 [43731]
Path:                  /Applications/MarginNote 4.app/Contents/MacOS/MarginNote 4
Identifier:            QReader.MarginStudy.easy
Version:               4.2.0 (20016)
App Item ID:           1531657269
Code Type:             ARM-64 (Native)
Parent Process:        launchd [1]
User ID:               501

Date/Time:             2025-07-04 17:35:36.2962 +0800
OS Version:            macOS 15.5 (24F74)
Report Version:        12
Anonymous UUID:        

Sleep/Wake UUID:       D94CE86A-3FBB-4420-961D-40051E15F466

Time Awake Since Boot: 360000 seconds
Time Since Wake:       8759 seconds

System Integrity Protection: enabled

Crashed Thread:        0  Dispatch queue: com.apple.main-thread

Exception Type:        EXC_CRASH (SIGABRT)
Exception Codes:       0x0000000000000000, 0x0000000000000000

Termination Reason:    Namespace SIGNAL, Code 6 Abort trap: 6
Terminating Process:   MarginNote 4 [43731]

Application Specific Information:
abort() called


Kernel Triage:
VM - (arg = 0x3) mach_vm_allocate_kernel failed within call to vm_map_enter
VM - (arg = 0x3) mach_vm_allocate_kernel failed within call to vm_map_enter
VM - (arg = 0x3) mach_vm_allocate_kernel failed within call to vm_map_enter


Thread 0 Crashed::  Dispatch queue: com.apple.main-thread
0   libsystem_kernel.dylib        	       0x192461388 __pthread_kill + 8
1   libsystem_pthread.dylib       	       0x19249a88c pthread_kill + 296
2   libsystem_c.dylib             	       0x1923a3cf0 __abort + 132
3   libsystem_c.dylib             	       0x1923a3c6c abort + 136
4   libc++abi.dylib               	       0x19245039c abort_message + 132
5   libc++abi.dylib               	       0x19243ed0c demangling_terminate_handler() + 344
6   libobjc.A.dylib               	       0x1920c4dd4 _objc_terminate() + 156
7   FirebaseCrashlytics           	       0x10433be14 FIRCLSTerminateHandler() + 340
8   libc++abi.dylib               	       0x19244f6b0 std::__terminate(void (*)()) + 16
9   libc++abi.dylib               	       0x192452efc __cxa_rethrow + 188
10  libobjc.A.dylib               	       0x1920e1bec objc_exception_rethrow + 44
11  CoreFoundation                	       0x192532a24 __108-[_CFXPreferences(SearchListAdditions) withSearchListForIdentifier:container:cloudConfigurationURL:perform:]_block_invoke + 488
12  CoreFoundation                	       0x1926bb54c -[_CFXPreferences withSearchListForIdentifier:container:cloudConfigurationURL:perform:] + 432
13  CoreFoundation                	       0x19258b144 -[_CFXPreferences setValue:forKey:appIdentifier:container:configurationURL:] + 124
14  CoreFoundation                	       0x19258b098 _CFPreferencesSetAppValueWithContainerAndConfiguration + 120
15  Foundation                    	       0x193b61360 -[NSUserDefaults(NSUserDefaults) setObject:forKey:] + 68
16  CoreFoundation                	       0x1925664d4 __invoking___ + 148
17  CoreFoundation                	       0x192566364 -[NSInvocation invoke] + 424
18  JavaScriptCore                	       0x1dbfc3520 JSC::ObjCCallbackFunctionImpl::call(JSContext*, OpaqueJSValue*, unsigned long, OpaqueJSValue const* const*, OpaqueJSValue const**) + 444
19  JavaScriptCore                	       0x1dbfc2ea8 JSC::objCCallbackFunctionCallAsFunction(OpaqueJSContext const*, OpaqueJSValue*, OpaqueJSValue*, unsigned long, OpaqueJSValue const* const*, OpaqueJSValue const**) + 184
20  JavaScriptCore                	       0x1dbfc15a4 JSC::callObjCCallbackFunction(JSC::JSGlobalObject*, JSC::CallFrame*) + 356
21  JavaScriptCore                	       0x1dd18ce4c llint_internal_function_call_trampoline + 56
22  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
23  JavaScriptCore                	       0x1dd1892c4 js_trampoline_op_call + 8
24  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
25  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
26  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
27  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
28  JavaScriptCore                	       0x1dd1892c4 js_trampoline_op_call + 8
29  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
30  JavaScriptCore                	       0x1dd18a964 js_trampoline_op_call_ignore_result + 8
31  JavaScriptCore                	       0x1dd15cbd8 vmEntryToJavaScriptTrampoline + 8
32  JavaScriptCore                	       0x1dc720f8c JSC::Interpreter::executeCall(JSC::JSObject*, JSC::CallData const&, JSC::JSValue, JSC::ArgList const&) + 888
33  JavaScriptCore                	       0x1dca67b9c JSC::runJSMicrotask(JSC::JSGlobalObject*, WTF::ObjectIdentifierGeneric<JSC::MicrotaskIdentifierType, WTF::ObjectIdentifierThreadSafeAccessTraits<unsigned long long>, unsigned long long>, JSC::JSValue, std::__1::span<JSC::JSValue const, 18446744073709551615ul>) + 472
34  JavaScriptCore                	       0x1dcce7324 JSC::VM::drainMicrotasks() + 508
35  JavaScriptCore                	       0x1dca661e4 JSC::JSLock::willReleaseLock() + 140
36  JavaScriptCore                	       0x1db98a96c JSC::JSLockHolder::~JSLockHolder() + 128
37  JavaScriptCore                	       0x1dbaa1c88 -[JSValue callWithArguments:] + 456
38  MarginNote 4                  	       0x102db0798 0x102320000 + 11077528
39  CoreFoundation                	       0x192564bbc ___forwarding___ + 956
40  CoreFoundation                	       0x192564740 _CF_forwarding_prep_0 + 96
41  MarginNote 4                  	       0x1024e14b4 0x102320000 + 1840308
42  CoreFoundation                	       0x19257a62c __CFNOTIFICATIONCENTER_IS_CALLING_OUT_TO_AN_OBSERVER__ + 148
43  CoreFoundation                	       0x192609ce8 ___CFXRegistrationPost_block_invoke + 92
44  CoreFoundation                	       0x192609c2c _CFXRegistrationPost + 436
45  CoreFoundation                	       0x192549a78 _CFXNotificationPost + 740
46  Foundation                    	       0x193b02680 -[NSNotificationCenter postNotificationName:object:userInfo:] + 88
47  MarginNote 4                  	       0x1024f2388 0x102320000 + 1909640
48  MarginNote 4                  	       0x102b935b4 0x102320000 + 8861108
49  MarginNote 4                  	       0x102d3f8a0 0x102320000 + 10614944
50  UIKitCore                     	       0x1c6668404 -[UIAlertController _invokeHandlersForAction:] + 88
51  UIKitCore                     	       0x1c6668c34 __103-[UIAlertController _dismissAnimated:triggeringAction:triggeredByPopoverDimmingView:dismissCompletion:]_block_invoke_2 + 36
52  UIKitCore                     	       0x1c61b4c5c -[UIPresentationController transitionDidFinish:] + 824
53  UIKitCore                     	       0x1c695baec __77-[UIPresentationController runTransitionForCurrentStateAnimated:handoffData:]_block_invoke.112 + 344
54  UIKitCore                     	       0x1c61b4880 -[_UIViewControllerTransitionContext completeTransition:] + 192
55  UIKitCore                     	       0x1c75452dc __UIVIEW_IS_EXECUTING_ANIMATION_COMPLETION_BLOCK__ + 36
56  UIKitCore                     	       0x1c61b715c -[UIViewAnimationBlockDelegate _didEndBlockAnimation:finished:context:] + 628
57  UIKitCore                     	       0x1c61b6cac -[UIViewAnimationState sendDelegateAnimationDidStop:finished:] + 436
58  UIKitCore                     	       0x1c6248c84 -[UIViewAnimationState animationDidStop:finished:] + 192
59  UIKit                         	       0x27d527700 -[UIViewAnimationStateAccessibility animationDidStop:finished:] + 252
60  UIKitCore                     	       0x1c6248cf4 -[UIViewAnimationState animationDidStop:finished:] + 304
61  UIKit                         	       0x27d527700 -[UIViewAnimationStateAccessibility animationDidStop:finished:] + 252
62  QuartzCore                    	       0x19b84d4a8 run_animation_callbacks(void*) + 132
63  libdispatch.dylib             	       0x1922fc85c _dispatch_client_callout + 16
64  libdispatch.dylib             	       0x192319b58 _dispatch_main_queue_drain.cold.5 + 812
65  libdispatch.dylib             	       0x1922f1db0 _dispatch_main_queue_drain + 180
66  libdispatch.dylib             	       0x1922f1cec _dispatch_main_queue_callback_4CF + 44
67  CoreFoundation                	       0x1925c3da4 __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__ + 16
68  CoreFoundation                	       0x192584a9c __CFRunLoopRun + 1980
69  CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
70  HIToolbox                     	       0x19e01827c RunCurrentEventLoopInMode + 324
71  HIToolbox                     	       0x19e01b4e8 ReceiveNextEventCommon + 676
72  HIToolbox                     	       0x19e1a6484 _BlockUntilNextEventMatchingListInModeWithFilter + 76
73  AppKit                        	       0x1964abab4 _DPSNextEvent + 684
74  AppKit                        	       0x196e4a5b0 -[NSApplication(NSEventRouting) _nextEventMatchingEventMask:untilDate:inMode:dequeue:] + 688
75  AppKit                        	       0x19649ec64 -[NSApplication run] + 480
76  AppKit                        	       0x19647535c NSApplicationMain + 880
77  AppKit                        	       0x1966c1cf4 _NSApplicationMainWithInfoDictionary + 24
78  UIKitMacHelper                	       0x1adaa8164 UINSApplicationMain + 976
79  UIKitCore                     	       0x1c611bc9c UIApplicationMain + 148
80  MarginNote 4                  	       0x1028c3c18 0x102320000 + 5913624
81  dyld                          	       0x1920fab98 start + 6076

Thread 1:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 2:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 3::  Dispatch queue: com.apple.libtrace.state.block-list
0   libsystem_kernel.dylib        	       0x19245a9b8 __ulock_wait + 8
1   libdispatch.dylib             	       0x1922e4cbc _dlock_wait + 56
2   libdispatch.dylib             	       0x1922e4adc _dispatch_thread_event_wait_slow + 56
3   libdispatch.dylib             	       0x1922f2a88 __DISPATCH_WAIT_FOR_QUEUE__ + 368
4   libdispatch.dylib             	       0x1922f2640 _dispatch_sync_f_slow + 148
5   libsystem_trace.dylib         	       0x1921ea7a8 ___os_state_request_for_self_block_invoke + 372
6   libdispatch.dylib             	       0x1922e2b2c _dispatch_call_block_and_release + 32
7   libdispatch.dylib             	       0x1922fc85c _dispatch_client_callout + 16
8   libdispatch.dylib             	       0x1922eb350 _dispatch_lane_serial_drain + 740
9   libdispatch.dylib             	       0x1922ebe60 _dispatch_lane_invoke + 440
10  libdispatch.dylib             	       0x1922f6264 _dispatch_root_queue_drain_deferred_wlh + 292
11  libdispatch.dylib             	       0x1922f5ae8 _dispatch_workloop_worker_thread + 540
12  libsystem_pthread.dylib       	       0x192496e64 _pthread_wqthread + 292
13  libsystem_pthread.dylib       	       0x192495b74 start_wqthread + 8

Thread 4:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 5:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 6:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 7:: com.apple.uikit.eventfetch-thread
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   Foundation                    	       0x193bc63a4 -[NSRunLoop(NSRunLoop) runUntilDate:] + 100
9   UIKitCore                     	       0x1c611d070 -[UIEventFetcher threadMain] + 104
10  Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
11  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
12  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 8:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 9:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 10:: com.google.firebase.crashlytics.MachExceptionServer
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   FirebaseCrashlytics           	       0x104344e68 FIRCLSMachExceptionServer + 104
5   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
6   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 11:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 12::  Dispatch queue: CSBackupSetItemExcluded() Spotlight Queue
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   libdispatch.dylib             	       0x1922fdeb8 _dispatch_mach_send_and_wait_for_reply + 548
5   libdispatch.dylib             	       0x1922fe258 dispatch_mach_send_with_result_and_wait_for_reply + 60
6   libxpc.dylib                  	       0x1921a0468 xpc_connection_send_message_with_reply_sync + 284
7   Metadata                      	       0x19b132d24 _itemsForPathsBulk + 104
8   Metadata                      	       0x19b132980 MDItemCreate + 660
9   CarbonCore                    	       0x19605f148 __SetURLExcluded_block_invoke_2 + 120
10  libdispatch.dylib             	       0x1922e2b2c _dispatch_call_block_and_release + 32
11  libdispatch.dylib             	       0x1922fc85c _dispatch_client_callout + 16
12  libdispatch.dylib             	       0x1922eb350 _dispatch_lane_serial_drain + 740
13  libdispatch.dylib             	       0x1922ebe60 _dispatch_lane_invoke + 440
14  libdispatch.dylib             	       0x1922f6264 _dispatch_root_queue_drain_deferred_wlh + 292
15  libdispatch.dylib             	       0x1922f5ae8 _dispatch_workloop_worker_thread + 540
16  libsystem_pthread.dylib       	       0x192496e64 _pthread_wqthread + 292
17  libsystem_pthread.dylib       	       0x192495b74 start_wqthread + 8

Thread 13:
0   libsystem_pthread.dylib       	       0x192495b6c start_wqthread + 0

Thread 14:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 15:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 16:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 17:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 18:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 19:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 20:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 21:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 22:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 23:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102dc0da0 0x102320000 + 11144608
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 24:: com.apple.NSURLConnectionLoader
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   CFNetwork                     	       0x1982928ec +[__CFN_CoreSchedulingSetRunnable _run:] + 416
8   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
9   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
10  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 25:: AXSpeech
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   TextToSpeech                  	       0x1c9852de0 0x1c9823000 + 196064
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 26:: JavaScriptCore libpas scavenger
0   libsystem_kernel.dylib        	       0x19245c3cc __psynch_cvwait + 8
1   libsystem_pthread.dylib       	       0x19249b0e0 _pthread_cond_wait + 984
2   JavaScriptCore                	       0x1dd140608 scavenger_thread_main + 1356
3   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
4   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 27:
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   Foundation                    	       0x193b52c78 -[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 212
8   MarginNote 4                  	       0x102af1b9c 0x102320000 + 8199068
9   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
10  libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
11  libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 28:: com.apple.NSEventThread
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192461764 mach_msg_overwrite + 484
3   libsystem_kernel.dylib        	       0x192458fa8 mach_msg + 24
4   CoreFoundation                	       0x192585e7c __CFRunLoopServiceMachPort + 160
5   CoreFoundation                	       0x192584798 __CFRunLoopRun + 1208
6   CoreFoundation                	       0x192583c58 CFRunLoopRunSpecific + 572
7   AppKit                        	       0x1965cf7fc _NSEventThread + 140
8   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
9   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 29:: Heap Helper Thread
0   libsystem_kernel.dylib        	       0x19245c3cc __psynch_cvwait + 8
1   libsystem_pthread.dylib       	       0x19249b0e0 _pthread_cond_wait + 984
2   JavaScriptCore                	       0x1dbb5c860 WTF::ThreadCondition::timedWait(WTF::Mutex&, WTF::WallTime) + 240
3   JavaScriptCore                	       0x1dbb188ac WTF::ParkingLot::parkConditionallyImpl(void const*, WTF::ScopedLambda<bool ()> const&, WTF::ScopedLambda<void ()> const&, WTF::TimeWithDynamicClockType const&) + 1916
4   JavaScriptCore                	       0x1dbad0fbc WTF::Detail::CallableWrapper<WTF::AutomaticThread::start(WTF::AbstractLocker const&)::$_0, void>::call() + 472
5   JavaScriptCore                	       0x1dbb59b00 WTF::Thread::entryPoint(WTF::Thread::NewThreadContext*) + 348
6   JavaScriptCore                	       0x1db9879bc WTF::wtfThreadEntryPoint(void*) + 16
7   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
8   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 30:: Heap Helper Thread
0   libsystem_kernel.dylib        	       0x19245c3cc __psynch_cvwait + 8
1   libsystem_pthread.dylib       	       0x19249b0e0 _pthread_cond_wait + 984
2   JavaScriptCore                	       0x1dbb5c860 WTF::ThreadCondition::timedWait(WTF::Mutex&, WTF::WallTime) + 240
3   JavaScriptCore                	       0x1dbb188ac WTF::ParkingLot::parkConditionallyImpl(void const*, WTF::ScopedLambda<bool ()> const&, WTF::ScopedLambda<void ()> const&, WTF::TimeWithDynamicClockType const&) + 1916
4   JavaScriptCore                	       0x1dbad0fbc WTF::Detail::CallableWrapper<WTF::AutomaticThread::start(WTF::AbstractLocker const&)::$_0, void>::call() + 472
5   JavaScriptCore                	       0x1dbb59b00 WTF::Thread::entryPoint(WTF::Thread::NewThreadContext*) + 348
6   JavaScriptCore                	       0x1db9879bc WTF::wtfThreadEntryPoint(void*) + 16
7   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
8   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 31:: Heap Helper Thread
0   libsystem_kernel.dylib        	       0x19245c3cc __psynch_cvwait + 8
1   libsystem_pthread.dylib       	       0x19249b0e0 _pthread_cond_wait + 984
2   JavaScriptCore                	       0x1dbb5c860 WTF::ThreadCondition::timedWait(WTF::Mutex&, WTF::WallTime) + 240
3   JavaScriptCore                	       0x1dbb188ac WTF::ParkingLot::parkConditionallyImpl(void const*, WTF::ScopedLambda<bool ()> const&, WTF::ScopedLambda<void ()> const&, WTF::TimeWithDynamicClockType const&) + 1916
4   JavaScriptCore                	       0x1dbad0fbc WTF::Detail::CallableWrapper<WTF::AutomaticThread::start(WTF::AbstractLocker const&)::$_0, void>::call() + 472
5   JavaScriptCore                	       0x1dbb59b00 WTF::Thread::entryPoint(WTF::Thread::NewThreadContext*) + 348
6   JavaScriptCore                	       0x1db9879bc WTF::wtfThreadEntryPoint(void*) + 16
7   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
8   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8

Thread 32:: HIE: M_ f47dd3624b273bb8 2025-07-04 17:35:36.022
0   libsystem_kernel.dylib        	       0x192458c34 mach_msg2_trap + 8
1   libsystem_kernel.dylib        	       0x19246b3a0 mach_msg2_internal + 76
2   libsystem_kernel.dylib        	       0x192488884 thread_suspend + 108
3   HIServices                    	       0x19931d504 SOME_OTHER_THREAD_SWALLOWED_AT_LEAST_ONE_EXCEPTION + 20
4   Foundation                    	       0x193b4cba8 __NSThread__start__ + 732
5   libsystem_pthread.dylib       	       0x19249ac0c _pthread_start + 136
6   libsystem_pthread.dylib       	       0x192495b80 thread_start + 8


Thread 0 crashed with ARM Thread State (64-bit):
    x0: 0x0000000000000000   x1: 0x0000000000000000   x2: 0x0000000000000000   x3: 0x0000000000000000
    x4: 0x0000000000000000   x5: 0x0000000000989680   x6: 0x000000000000006e   x7: 0x000000000000021c
    x8: 0xbdc81d51c1f78a99   x9: 0xbdc81d53c1ad1599  x10: 0x00000000000003e8  x11: 0x000000000000000b
   x12: 0x000000000000000b  x13: 0x00000001929829c2  x14: 0x00000000001ff800  x15: 0x00000000000007fb
   x16: 0x0000000000000148  x17: 0x00000002015f9fa8  x18: 0x0000000000000000  x19: 0x0000000000000006
   x20: 0x0000000000000103  x21: 0x00000002005a9fe0  x22: 0x0000000000000007  x23: 0x000000010436c617
   x24: 0x0000000000000000  x25: 0x0000000000000000  x26: 0x0000000000000002  x27: 0x0000000000000002
   x28: 0x000000000000000a   fp: 0x000000016dadb2a0   lr: 0x000000019249a88c
    sp: 0x000000016dadb280   pc: 0x0000000192461388 cpsr: 0x40001000
   far: 0x0000000000000000  esr: 0x56000080  Address size fault

Binary Images:
       0x102320000 -        0x103a1bfff QReader.MarginStudy.easy (4.2.0) <b40e9e56-02af-3524-979b-d73066c84858> /Applications/MarginNote 4.app/Contents/MacOS/MarginNote 4
       0x103f44000 -        0x103f4ffff org.cocoapods.FBLPromises (4.2.0) <f86ae958-11fb-3f3e-b00e-69b4314260a3> /Applications/MarginNote 4.app/Contents/Frameworks/FBLPromises.framework/Versions/A/FBLPromises
       0x103ef0000 -        0x103efffff org.cocoapods.FirebaseCore (4.2.0) <0fd06fca-acba-36f4-84f0-56fcaf80928d> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseCore.framework/Versions/A/FirebaseCore
       0x103f70000 -        0x103f73fff org.cocoapods.FirebaseCoreExtension (4.2.0) <77705319-160e-31e4-b17b-15939a5040fb> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseCoreExtension.framework/Versions/A/FirebaseCoreExtension
       0x10402c000 -        0x104043fff org.cocoapods.FirebaseCoreInternal (4.2.0) <71083897-cb75-37ee-a6e4-25ab28d8d7cf> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseCoreInternal.framework/Versions/A/FirebaseCoreInternal
       0x10432c000 -        0x10437bfff org.cocoapods.FirebaseCrashlytics (4.2.0) <deb4d0e3-c011-30ef-942b-bd8200ba9904> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseCrashlytics.framework/Versions/A/FirebaseCrashlytics
       0x104080000 -        0x104093fff org.cocoapods.FirebaseInstallations (4.2.0) <d805f230-947f-32d0-bb26-acbf411fef75> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseInstallations.framework/Versions/A/FirebaseInstallations
       0x103f20000 -        0x103f27fff org.cocoapods.FirebaseRemoteConfigInterop (4.2.0) <d8a2884f-2cd7-3357-8b94-95f49042cc09> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseRemoteConfigInterop.framework/Versions/A/FirebaseRemoteConfigInterop
       0x103f84000 -        0x103f9ffff org.cocoapods.FirebaseSessions (4.2.0) <bb07366d-d78f-3a56-9faf-3f6c768ce485> /Applications/MarginNote 4.app/Contents/Frameworks/FirebaseSessions.framework/Versions/A/FirebaseSessions
       0x104178000 -        0x10419bfff org.cocoapods.GoogleDataTransport (4.2.0) <7cc021c1-d9a0-3efa-8a21-5a8bcc77d91b> /Applications/MarginNote 4.app/Contents/Frameworks/GoogleDataTransport.framework/Versions/A/GoogleDataTransport
       0x103fdc000 -        0x103ff3fff org.cocoapods.GoogleUtilities (4.2.0) <b670133a-a885-3b47-8613-a88a46786ac6> /Applications/MarginNote 4.app/Contents/Frameworks/GoogleUtilities.framework/Versions/A/GoogleUtilities
       0x104124000 -        0x104133fff org.cocoapods.Promises (4.2.0) <06183135-4de9-3613-9417-880174d9a750> /Applications/MarginNote 4.app/Contents/Frameworks/Promises.framework/Versions/A/Promises
       0x1040e4000 -        0x1040e7fff org.cocoapods.nanopb (4.2.0) <f94825bf-33e5-3ae1-a298-64e453c53671> /Applications/MarginNote 4.app/Contents/Frameworks/nanopb.framework/Versions/A/nanopb
       0x1043fc000 -        0x10443ffff com.downMarkdown.Down (4.2.0) <0df0b467-46e7-3c9b-9a5f-9c4f20a14451> /Applications/MarginNote 4.app/Contents/Frameworks/Down.framework/Versions/A/Down
       0x1040f8000 -        0x10410bfff com.ziparchive.ZipArchive (4.2.0) <1984df90-69be-30ea-b3f1-318feef4746b> /Applications/MarginNote 4.app/Contents/Frameworks/ZipArchive.framework/Versions/A/ZipArchive
       0x1040bc000 -        0x1040c7fff org.cocoapods.ConcaveHull (4.2.0) <fd9a4b3d-7c7d-3288-a531-23d30992e2da> /Applications/MarginNote 4.app/Contents/Frameworks/ConcaveHull.framework/Versions/A/ConcaveHull
       0x104780000 -        0x1048c3fff com.Tencent.WCDB (4.2.0) <3d4d4dd8-0803-301e-8ec6-fdab287520b8> /Applications/MarginNote 4.app/Contents/Frameworks/WCDB.framework/Versions/A/WCDB
       0x1041d8000 -        0x104227fff com.mixpanel.Mixpanel (4.2.0) <f1855e19-2b40-3376-9e34-d887bed9d0c4> /Applications/MarginNote 4.app/Contents/Frameworks/Mixpanel.framework/Versions/A/Mixpanel
       0x1045c4000 -        0x10460ffff com.uservoice.UserVoiceSDK (4.2.0) <05a04b59-c1da-3aa5-8a8b-0ad8f2e7fdcc> /Applications/MarginNote 4.app/Contents/Frameworks/UserVoice.framework/Versions/A/UserVoice
       0x104470000 -        0x10447ffff QReader.S.Swinject (4.2.0) <70e9d0fe-1c46-3909-9545-64e3b672966f> /Applications/MarginNote 4.app/Contents/Frameworks/Swinject.framework/Versions/A/Swinject
       0x104158000 -        0x10415ffff QReader.S.AsyncSwift (4.2.0) <04fb0895-6947-3860-a35f-b0d8ee65b61d> /Applications/MarginNote 4.app/Contents/Frameworks/Async.framework/Versions/A/Async
       0x104280000 -        0x1042a7fff QReader.S.EVReflection (4.2.0) <6dfd4d18-f59b-39ba-bc8f-371d8d8578a8> /Applications/MarginNote 4.app/Contents/Frameworks/EVReflection.framework/Versions/A/EVReflection
       0x104670000 -        0x1046c3fff QReader.S.Alamofire (4.2.0) <14f0248c-6524-3c71-bfb0-c4e623c3e32c> /Applications/MarginNote 4.app/Contents/Frameworks/Alamofire.framework/Versions/A/Alamofire
       0x104554000 -        0x10455ffff libobjc-trampolines.dylib (*) <d02a05cb-6440-3e7e-a02f-931734cab666> /usr/lib/libobjc-trampolines.dylib
       0x10cb10000 -        0x10d1a3fff com.apple.AGXMetal13-3 (327.5) <bea42a86-a627-3c22-8eec-738c406242ff> /System/Library/Extensions/AGXMetal13_3.bundle/Contents/MacOS/AGXMetal13_3
       0x127960000 -        0x12796bfff com.apple.UIKitMacHelper.axbundle (1.0) <4203490e-bc3b-33a0-90ba-867563425439> /System/Library/Accessibility/BundlesBase/com.apple.UIKitMacHelper.axbundle/Versions/A/com.apple.UIKitMacHelper
       0x192458000 -        0x192493653 libsystem_kernel.dylib (*) <60485b6f-67e5-38c1-aec9-efd6031ff166> /usr/lib/system/libsystem_kernel.dylib
       0x192494000 -        0x1924a0a47 libsystem_pthread.dylib (*) <647b91fc-96d3-3bbb-af08-970df45257c8> /usr/lib/system/libsystem_pthread.dylib
       0x19232b000 -        0x1923ac46f libsystem_c.dylib (*) <f4529d5e-24f3-3bbb-bd3c-984856875fc8> /usr/lib/system/libsystem_c.dylib
       0x19243a000 -        0x192457fff libc++abi.dylib (*) <4db4ac5c-e091-3a2e-a149-b7955b8af852> /usr/lib/libc++abi.dylib
       0x1920a0000 -        0x1920f3893 libobjc.A.dylib (*) <4966864d-c147-33d3-bb18-1e3979590b6d> /usr/lib/libobjc.A.dylib
       0x192509000 -        0x192a47fff com.apple.CoreFoundation (6.9) <df489a59-b4f6-32b8-9bb4-9b832960aa52> /System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation
       0x193af9000 -        0x1948e22ff com.apple.Foundation (6.9) <e8f6a451-0acc-3e05-b18f-fec6618ce44a> /System/Library/Frameworks/Foundation.framework/Versions/C/Foundation
       0x1db97e000 -        0x1dd34ccbf com.apple.JavaScriptCore (20621) <2a97bf13-e372-380e-a1d4-177c2d81af46> /System/iOSSupport/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/JavaScriptCore
       0x1c6118000 -        0x1c7eac9ff com.apple.UIKitCore (1.0) <9bac5042-7dbf-39da-8726-3fa7d5e88098> /System/iOSSupport/System/Library/PrivateFrameworks/UIKitCore.framework/Versions/A/UIKitCore
       0x27d3c7000 -        0x27d5b971f com.apple.UIKit.axbundle (1.0.0) <6ef52093-a61b-373e-8aae-7827422db827> /System/iOSSupport/System/Library/AccessibilityBundles/UIKit.axbundle/Contents/MacOS/UIKit
       0x19b5d5000 -        0x19b9a8c7f com.apple.QuartzCore (1.11) <e0d9f378-dc87-33f8-93a5-3c62ad30ea19> /System/Library/Frameworks/QuartzCore.framework/Versions/A/QuartzCore
       0x1922e1000 -        0x19232773f libdispatch.dylib (*) <8bf83cda-8db1-3d46-94b0-d811bd77e078> /usr/lib/system/libdispatch.dylib
       0x19df55000 -        0x19e25bfdf com.apple.HIToolbox (2.1.1) <9286e29f-fcee-31d0-acea-2842ea23bedf> /System/Library/Frameworks/Carbon.framework/Versions/A/Frameworks/HIToolbox.framework/Versions/A/HIToolbox
       0x196471000 -        0x197902c7f com.apple.AppKit (6.9) <5d0da1bd-412c-3ed8-84e9-40ca62fe7b42> /System/Library/Frameworks/AppKit.framework/Versions/C/AppKit
       0x1adaa4000 -        0x1adbc10bf com.apple.UIKitMacHelper (1.0) <a5f79014-5908-30e8-8bd2-e3bceb891202> /System/Library/PrivateFrameworks/UIKitMacHelper.framework/Versions/A/UIKitMacHelper
       0x1920f4000 -        0x19218f4cf dyld (*) <9cf0401a-a938-389e-a77d-9e9608076ccf> /usr/lib/dyld
               0x0 - 0xffffffffffffffff ??? (*) <00000000-0000-0000-0000-000000000000> ???
       0x1921df000 -        0x1921fa7ff libsystem_trace.dylib (*) <c8ed43c4-c077-34e9-ab26-f34231c895be> /usr/lib/system/libsystem_trace.dylib
       0x192194000 -        0x1921de8ff libxpc.dylib (*) <3b8ae373-80d2-36a4-a628-0cf6cf083703> /usr/lib/system/libxpc.dylib
       0x19b131000 -        0x19b1bb13f com.apple.Metadata (15.5) <713fb6e3-7d7e-309f-b0db-18cd679c93a8> /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/Metadata.framework/Versions/A/Metadata
       0x195fad000 -        0x19629fcbf com.apple.CoreServices.CarbonCore (1333) <6434a7be-a5cd-3df4-ba18-4d1359333044> /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/CarbonCore.framework/Versions/A/CarbonCore
       0x19803e000 -        0x1984081bf com.apple.CFNetwork (1.0) <c2fd723b-4e94-3d53-97dd-6bf958117f98> /System/Library/Frameworks/CFNetwork.framework/Versions/A/CFNetwork
       0x1c9823000 -        0x1c9a4e0ff com.apple.texttospeech (1.0.0) <2e7f826e-d72c-336f-bd30-2a9fc96a341a> /System/Library/PrivateFrameworks/TextToSpeech.framework/Versions/A/TextToSpeech
       0x1992e7000 -        0x19935339f com.apple.HIServices (1.22) <9f96148e-f999-34d5-a7d6-bb6d8c75dae1> /System/Library/Frameworks/ApplicationServices.framework/Versions/A/Frameworks/HIServices.framework/Versions/A/HIServices

External Modification Summary:
  Calls made by other processes targeting this process:
    task_for_pid: 0
    thread_create: 0
    thread_set_state: 0
  Calls made by this process:
    task_for_pid: 0
    thread_create: 0
    thread_set_state: 0
  Calls made by all processes on this machine:
    task_for_pid: 0
    thread_create: 0
    thread_set_state: 0

VM Region Summary:
ReadOnly portion of Libraries: Total=1.7G resident=0K(0%) swapped_out_or_unallocated=1.7G(100%)
Writable regions: Total=6.1G written=1988K(0%) resident=1060K(0%) swapped_out=22.8M(0%) unallocated=6.1G(100%)

                                VIRTUAL   REGION 
REGION TYPE                        SIZE    COUNT (non-coalesced) 
===========                     =======  ======= 
Accelerate framework               384K        3 
Activity Tracing                   256K        1 
CG image                           176K       10 
CG raster data                    5312K      145 
ColorSync                          608K       30 
CoreAnimation                     14.7M      458 
CoreData                            64K        2 
CoreData Object IDs               4112K        2 
CoreGraphics                        32K        2 
CoreUI image data                 3248K       23 
Foundation                          64K        2 
Image IO                          26.2M      284 
Kernel Alloc Once                   32K        1 
MALLOC                             1.7G      105 
MALLOC guard page                  384K       24 
Mach message                        32K        2 
Memory Tag 241                      32K        1 
SQLite page cache                 11.6M       93 
STACK GUARD                       56.5M       32 
Stack                             24.5M       33 
VM_ALLOCATE                      128.9M       18 
VM_ALLOCATE (reserved)             3.9G        1         reserved VM address space (unallocated)
WebKit Malloc                    331.1M       31 
__AUTH                            6194K      769 
__AUTH_CONST                      79.9M     1001 
__CTF                               824        1 
__DATA                            27.4M     1003 
__DATA_CONST                      29.8M     1033 
__DATA_DIRTY                      2746K      339 
__FONT_DATA                        2352        1 
__INFO_FILTER                         8        1 
__LINKEDIT                       621.1M       27 
__OBJC_RO                         61.4M        1 
__OBJC_RW                         2396K        1 
__TEXT                             1.1G     1056 
__TPRO_CONST                       128K        2 
dyld private memory                128K        1 
libnetwork                        1664K       24 
mapped file                      448.4M      238 
page table in kernel              1060K        1 
shared memory                      944K       19 
===========                     =======  ======= 
TOTAL                              8.5G     6821 
TOTAL, minus reserved VM space     4.6G     6821 



-----------
Full Report
-----------

{"roots_installed":0,"app_cohort":"2|date=1750402800000&sf=143465&tid=5f971e39c93a9110f40616df0bff5cec86fe5f4278d9a40dda37f1f97dfe45d0&ttype=i","app_name":"MarginNote 4","app_version":"4.2.0","timestamp":"2025-07-04 17:35:39.00 +0800","slice_uuid":"b40e9e56-02af-3524-979b-d73066c84858","adam_id":"1531657269","build_version":"20016","platform":6,"bundleID":"QReader.MarginStudy.easy","share_with_app_devs":0,"is_first_party":0,"bug_type":"309","os_version":"macOS 15.5 (24F74)","incident_id":"720B480A-DB8B-4AF3-8B0D-CC02BA883410","name":"MarginNote 4","is_beta":1}
{
  "uptime" : 360000,
  "procRole" : "Foreground",
  "version" : 2,
  "userID" : 501,
  "deployVersion" : 210,
  "modelCode" : "MacBookPro17,1",
  "coalitionID" : 1312,
  "osVersion" : {
    "train" : "macOS 15.5",
    "build" : "24F74",
    "releaseType" : "User"
  },
  "captureTime" : "2025-07-04 17:35:36.2962 +0800",
  "codeSigningMonitor" : 1,
  "incident" : "720B480A-DB8B-4AF3-8B0D-CC02BA883410",
  "pid" : 43731,
  "translated" : false,
  "cpuType" : "ARM-64",
  "roots_installed" : 0,
  "bug_type" : "309",
  "procLaunch" : "2025-07-04 17:35:27.3370 +0800",
  "procStartAbsTime" : 8697446889786,
  "procExitAbsTime" : 8697660621074,
  "procName" : "MarginNote 4",
  "procPath" : "\/Applications\/MarginNote 4.app\/Contents\/MacOS\/MarginNote 4",
  "bundleInfo" : {"CFBundleShortVersionString":"4.2.0","CFBundleVersion":"20016","CFBundleIdentifier":"QReader.MarginStudy.easy"},
  "storeInfo" : {"storeCohortMetadata":"2|date=1750402800000&sf=143465&tid=5f971e39c93a9110f40616df0bff5cec86fe5f4278d9a40dda37f1f97dfe45d0&ttype=i","itemID":"1531657269","deviceIdentifierForVendor":"6F2DC8F7-A7E1-5796-B484-7AEF068D6F3E","thirdParty":true,"entitledBeta":true},
  "parentProc" : "launchd",
  "parentPid" : 1,
  "coalitionName" : "QReader.MarginStudy.easy",
  "isBeta" : 1,
  "appleIntelligenceStatus" : {"reasons":["countryBillingIneligible","regionIneligible","countryLocationIneligible"],"state":"unavailable"},
  "codeSigningID" : "QReader.MarginStudy.easy",
  "codeSigningTeamID" : "GEK3Z2S4G8",
  "codeSigningFlags" : 570506001,
  "codeSigningValidationCategory" : 2,
  "codeSigningTrustLevel" : 4294967295,
  "codeSigningAuxiliaryInfo" : 9007199254740992,
  "instructionByteStream" : {"beforePC":"fyMD1f17v6n9AwCRm+D\/l78DAJH9e8Go\/w9f1sADX9YQKYDSARAA1A==","atPC":"AwEAVH8jA9X9e7+p\/QMAkZDg\/5e\/AwCR\/XvBqP8PX9bAA1\/WcAqA0g=="},
  "bootSessionUUID" : "563496C0-63F9-4075-8D38-6242AE582E95",
  "wakeTime" : 8759,
  "sleepWakeUUID" : "D94CE86A-3FBB-4420-961D-40051E15F466",
  "sip" : "enabled",
  "exception" : {"codes":"0x0000000000000000, 0x0000000000000000","rawCodes":[0,0],"type":"EXC_CRASH","signal":"SIGABRT"},
  "termination" : {"flags":0,"code":6,"namespace":"SIGNAL","indicator":"Abort trap: 6","byProc":"MarginNote 4","byPid":43731},
  "ktriageinfo" : "VM - (arg = 0x3) mach_vm_allocate_kernel failed within call to vm_map_enter\nVM - (arg = 0x3) mach_vm_allocate_kernel failed within call to vm_map_enter\nVM - (arg = 0x3) mach_vm_allocate_kernel failed within call to vm_map_enter\n",
  "asi" : {"libsystem_c.dylib":["abort() called"]},
  "extMods" : {"caller":{"thread_create":0,"thread_set_state":0,"task_for_pid":0},"system":{"thread_create":0,"thread_set_state":0,"task_for_pid":0},"targeted":{"thread_create":0,"thread_set_state":0,"task_for_pid":0},"warnings":0},
  "lastExceptionBacktrace" : [{"imageOffset":973972,"symbol":"__exceptionPreprocess","symbolLocation":164,"imageIndex":31},{"imageOffset":109456,"symbol":"objc_exception_throw","symbolLocation":88,"imageIndex":30},{"imageOffset":1999324,"symbol":"-[__NSCFString characterAtIndex:].cold.1","symbolLocation":0,"imageIndex":31},{"imageOffset":1102736,"symbol":"_CFPrefsValidateValueForKey","symbolLocation":256,"imageIndex":31},{"imageOffset":253236,"symbol":"createDeepCopyOfValueForKey","symbolLocation":180,"imageIndex":31},{"imageOffset":252364,"symbol":"-[CFPrefsSource setValues:forKeys:count:copyValues:removeValuesForKeys:count:from:]","symbolLocation":348,"imageIndex":31},{"imageOffset":533112,"symbol":"-[CFPrefsSource setValue:forKey:from:]","symbolLocation":72,"imageIndex":31},{"imageOffset":532904,"symbol":"__76-[_CFXPreferences setValue:forKey:appIdentifier:container:configurationURL:]_block_invoke","symbolLocation":60,"imageIndex":31},{"imageOffset":170424,"symbol":"__108-[_CFXPreferences(SearchListAdditions) withSearchListForIdentifier:container:cloudConfigurationURL:perform:]_block_invoke","symbolLocation":380,"imageIndex":31},{"imageOffset":1779020,"symbol":"-[_CFXPreferences withSearchListForIdentifier:container:cloudConfigurationURL:perform:]","symbolLocation":432,"imageIndex":31},{"imageOffset":532804,"symbol":"-[_CFXPreferences setValue:forKey:appIdentifier:container:configurationURL:]","symbolLocation":124,"imageIndex":31},{"imageOffset":532632,"symbol":"_CFPreferencesSetAppValueWithContainerAndConfiguration","symbolLocation":120,"imageIndex":31},{"imageOffset":426848,"symbol":"-[NSUserDefaults(NSUserDefaults) setObject:forKey:]","symbolLocation":68,"imageIndex":32},{"imageOffset":382164,"symbol":"__invoking___","symbolLocation":148,"imageIndex":31},{"imageOffset":381796,"symbol":"-[NSInvocation invoke]","symbolLocation":424,"imageIndex":31},{"imageOffset":6575392,"symbol":"JSC::ObjCCallbackFunctionImpl::call(JSContext*, OpaqueJSValue*, unsigned long, OpaqueJSValue const* const*, OpaqueJSValue const**)","symbolLocation":444,"imageIndex":33},{"imageOffset":6573736,"symbol":"JSC::objCCallbackFunctionCallAsFunction(OpaqueJSContext const*, OpaqueJSValue*, OpaqueJSValue*, unsigned long, OpaqueJSValue const* const*, OpaqueJSValue const**)","symbolLocation":184,"imageIndex":33},{"imageOffset":6567332,"symbol":"JSC::callObjCCallbackFunction(JSC::JSGlobalObject*, JSC::CallFrame*)","symbolLocation":356,"imageIndex":33},{"imageOffset":25226828,"symbol":"llint_internal_function_call_trampoline","symbolLocation":56,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25211588,"symbol":"op_call_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25211588,"symbol":"op_call_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25217380,"symbol":"op_call_ignore_result_return_location","symbolLocation":0,"imageIndex":33},{"imageOffset":25029592,"symbol":"vmEntryToJavaScriptGateAfter","symbolLocation":0,"imageIndex":33},{"imageOffset":14299020,"symbol":"JSC::Interpreter::executeCall(JSC::JSObject*, JSC::CallData const&, JSC::JSValue, JSC::ArgList const&)","symbolLocation":888,"imageIndex":33},{"imageOffset":17734556,"symbol":"JSC::runJSMicrotask(JSC::JSGlobalObject*, WTF::ObjectIdentifierGeneric<JSC::MicrotaskIdentifierType, WTF::ObjectIdentifierThreadSafeAccessTraits<unsigned long long>, unsigned long long>, JSC::JSValue, std::__1::span<JSC::JSValue const, 18446744073709551615ul>)","symbolLocation":472,"imageIndex":33},{"imageOffset":20353828,"symbol":"JSC::VM::drainMicrotasks()","symbolLocation":508,"imageIndex":33},{"imageOffset":17727972,"symbol":"JSC::JSLock::willReleaseLock()","symbolLocation":140,"imageIndex":33},{"imageOffset":51564,"symbol":"JSC::JSLockHolder::~JSLockHolder()","symbolLocation":128,"imageIndex":33},{"imageOffset":1195144,"symbol":"-[JSValue callWithArguments:]","symbolLocation":456,"imageIndex":33},{"imageOffset":11077528,"imageIndex":0},{"imageOffset":375740,"symbol":"___forwarding___","symbolLocation":956,"imageIndex":31},{"imageOffset":374592,"symbol":"_CF_forwarding_prep_0","symbolLocation":96,"imageIndex":31},{"imageOffset":1840308,"imageIndex":0},{"imageOffset":464428,"symbol":"__CFNOTIFICATIONCENTER_IS_CALLING_OUT_TO_AN_OBSERVER__","symbolLocation":148,"imageIndex":31},{"imageOffset":1051880,"symbol":"___CFXRegistrationPost_block_invoke","symbolLocation":92,"imageIndex":31},{"imageOffset":1051692,"symbol":"_CFXRegistrationPost","symbolLocation":436,"imageIndex":31},{"imageOffset":264824,"symbol":"_CFXNotificationPost","symbolLocation":740,"imageIndex":31},{"imageOffset":38528,"symbol":"-[NSNotificationCenter postNotificationName:object:userInfo:]","symbolLocation":88,"imageIndex":32},{"imageOffset":1909640,"imageIndex":0},{"imageOffset":8861108,"imageIndex":0},{"imageOffset":10614944,"imageIndex":0},{"imageOffset":5571588,"symbol":"-[UIAlertController _invokeHandlersForAction:]","symbolLocation":88,"imageIndex":34},{"imageOffset":5573684,"symbol":"__103-[UIAlertController _dismissAnimated:triggeringAction:triggeredByPopoverDimmingView:dismissCompletion:]_block_invoke_2","symbolLocation":36,"imageIndex":34},{"imageOffset":642140,"symbol":"-[UIPresentationController transitionDidFinish:]","symbolLocation":824,"imageIndex":34},{"imageOffset":8665836,"symbol":"__77-[UIPresentationController runTransitionForCurrentStateAnimated:handoffData:]_block_invoke.112","symbolLocation":344,"imageIndex":34},{"imageOffset":641152,"symbol":"-[_UIViewControllerTransitionContext completeTransition:]","symbolLocation":192,"imageIndex":34},{"imageOffset":21156572,"symbol":"__UIVIEW_IS_EXECUTING_ANIMATION_COMPLETION_BLOCK__","symbolLocation":36,"imageIndex":34},{"imageOffset":651612,"symbol":"-[UIViewAnimationBlockDelegate _didEndBlockAnimation:finished:context:]","symbolLocation":628,"imageIndex":34},{"imageOffset":650412,"symbol":"-[UIViewAnimationState sendDelegateAnimationDidStop:finished:]","symbolLocation":436,"imageIndex":34},{"imageOffset":1248388,"symbol":"-[UIViewAnimationState animationDidStop:finished:]","symbolLocation":192,"imageIndex":34},{"imageOffset":1443584,"symbol":"-[UIViewAnimationStateAccessibility animationDidStop:finished:]","symbolLocation":252,"imageIndex":35},{"imageOffset":1248500,"symbol":"-[UIViewAnimationState animationDidStop:finished:]","symbolLocation":304,"imageIndex":34},{"imageOffset":1443584,"symbol":"-[UIViewAnimationStateAccessibility animationDidStop:finished:]","symbolLocation":252,"imageIndex":35},{"imageOffset":2589864,"symbol":"run_animation_callbacks(void*)","symbolLocation":132,"imageIndex":36},{"imageOffset":112732,"symbol":"_dispatch_client_callout","symbolLocation":16,"imageIndex":37},{"imageOffset":232280,"symbol":"_dispatch_main_queue_drain.cold.5","symbolLocation":812,"imageIndex":37},{"imageOffset":69040,"symbol":"_dispatch_main_queue_drain","symbolLocation":180,"imageIndex":37},{"imageOffset":68844,"symbol":"_dispatch_main_queue_callback_4CF","symbolLocation":44,"imageIndex":37},{"imageOffset":765348,"symbol":"__CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__","symbolLocation":16,"imageIndex":31},{"imageOffset":506524,"symbol":"__CFRunLoopRun","symbolLocation":1980,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":799356,"symbol":"RunCurrentEventLoopInMode","symbolLocation":324,"imageIndex":38},{"imageOffset":812264,"symbol":"ReceiveNextEventCommon","symbolLocation":676,"imageIndex":38},{"imageOffset":2430084,"symbol":"_BlockUntilNextEventMatchingListInModeWithFilter","symbolLocation":76,"imageIndex":38},{"imageOffset":240308,"symbol":"_DPSNextEvent","symbolLocation":684,"imageIndex":39},{"imageOffset":10327472,"symbol":"-[NSApplication(NSEventRouting) _nextEventMatchingEventMask:untilDate:inMode:dequeue:]","symbolLocation":688,"imageIndex":39},{"imageOffset":187492,"symbol":"-[NSApplication run]","symbolLocation":480,"imageIndex":39},{"imageOffset":17244,"symbol":"NSApplicationMain","symbolLocation":880,"imageIndex":39},{"imageOffset":2428148,"symbol":"+[NSWindow _savedFrameFromString:]","symbolLocation":0,"imageIndex":39},{"imageOffset":16740,"symbol":"UINSApplicationMain","symbolLocation":976,"imageIndex":40},{"imageOffset":15516,"symbol":"UIApplicationMain","symbolLocation":148,"imageIndex":34},{"imageOffset":5913624,"imageIndex":0},{"imageOffset":27544,"symbol":"start","symbolLocation":6076,"imageIndex":41}],
  "faultingThread" : 0,
  "threads" : [{"triggered":true,"id":9929134,"threadState":{"x":[{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":10000000},{"value":110},{"value":540},{"value":13675212505494293145},{"value":13675212514079348121},{"value":1000},{"value":11},{"value":11},{"value":6754412994},{"value":2095104},{"value":2043},{"value":328},{"value":8612978600},{"value":0},{"value":6},{"value":259},{"value":8595873760,"symbolLocation":224,"symbol":"_main_thread"},{"value":7},{"value":4365665815,"symbolLocation":10720,"symbol":"FIRCLSHexMap"},{"value":0},{"value":0},{"value":2},{"value":2},{"value":10}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749268108},"cpsr":{"value":1073745920},"fp":{"value":6135067296},"sp":{"value":6135067264},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749033352,"matchesCrashFrame":1},"far":{"value":0}},"queue":"com.apple.main-thread","frames":[{"imageOffset":37768,"symbol":"__pthread_kill","symbolLocation":8,"imageIndex":26},{"imageOffset":26764,"symbol":"pthread_kill","symbolLocation":296,"imageIndex":27},{"imageOffset":494832,"symbol":"__abort","symbolLocation":132,"imageIndex":28},{"imageOffset":494700,"symbol":"abort","symbolLocation":136,"imageIndex":28},{"imageOffset":91036,"symbol":"abort_message","symbolLocation":132,"imageIndex":29},{"imageOffset":19724,"symbol":"demangling_terminate_handler()","symbolLocation":344,"imageIndex":29},{"imageOffset":150996,"symbol":"_objc_terminate()","symbolLocation":156,"imageIndex":30},{"imageOffset":65044,"symbol":"FIRCLSTerminateHandler()","symbolLocation":340,"imageIndex":5},{"imageOffset":87728,"symbol":"std::__terminate(void (*)())","symbolLocation":16,"imageIndex":29},{"imageOffset":102140,"symbol":"__cxa_rethrow","symbolLocation":188,"imageIndex":29},{"imageOffset":269292,"symbol":"objc_exception_rethrow","symbolLocation":44,"imageIndex":30},{"imageOffset":170532,"symbol":"__108-[_CFXPreferences(SearchListAdditions) withSearchListForIdentifier:container:cloudConfigurationURL:perform:]_block_invoke","symbolLocation":488,"imageIndex":31},{"imageOffset":1779020,"symbol":"-[_CFXPreferences withSearchListForIdentifier:container:cloudConfigurationURL:perform:]","symbolLocation":432,"imageIndex":31},{"imageOffset":532804,"symbol":"-[_CFXPreferences setValue:forKey:appIdentifier:container:configurationURL:]","symbolLocation":124,"imageIndex":31},{"imageOffset":532632,"symbol":"_CFPreferencesSetAppValueWithContainerAndConfiguration","symbolLocation":120,"imageIndex":31},{"imageOffset":426848,"symbol":"-[NSUserDefaults(NSUserDefaults) setObject:forKey:]","symbolLocation":68,"imageIndex":32},{"imageOffset":382164,"symbol":"__invoking___","symbolLocation":148,"imageIndex":31},{"imageOffset":381796,"symbol":"-[NSInvocation invoke]","symbolLocation":424,"imageIndex":31},{"imageOffset":6575392,"symbol":"JSC::ObjCCallbackFunctionImpl::call(JSContext*, OpaqueJSValue*, unsigned long, OpaqueJSValue const* const*, OpaqueJSValue const**)","symbolLocation":444,"imageIndex":33},{"imageOffset":6573736,"symbol":"JSC::objCCallbackFunctionCallAsFunction(OpaqueJSContext const*, OpaqueJSValue*, OpaqueJSValue*, unsigned long, OpaqueJSValue const* const*, OpaqueJSValue const**)","symbolLocation":184,"imageIndex":33},{"imageOffset":6567332,"symbol":"JSC::callObjCCallbackFunction(JSC::JSGlobalObject*, JSC::CallFrame*)","symbolLocation":356,"imageIndex":33},{"imageOffset":25226828,"symbol":"llint_internal_function_call_trampoline","symbolLocation":56,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25211588,"symbol":"js_trampoline_op_call","symbolLocation":8,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25211588,"symbol":"js_trampoline_op_call","symbolLocation":8,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25217380,"symbol":"js_trampoline_op_call_ignore_result","symbolLocation":8,"imageIndex":33},{"imageOffset":25029592,"symbol":"vmEntryToJavaScriptTrampoline","symbolLocation":8,"imageIndex":33},{"imageOffset":14299020,"symbol":"JSC::Interpreter::executeCall(JSC::JSObject*, JSC::CallData const&, JSC::JSValue, JSC::ArgList const&)","symbolLocation":888,"imageIndex":33},{"imageOffset":17734556,"symbol":"JSC::runJSMicrotask(JSC::JSGlobalObject*, WTF::ObjectIdentifierGeneric<JSC::MicrotaskIdentifierType, WTF::ObjectIdentifierThreadSafeAccessTraits<unsigned long long>, unsigned long long>, JSC::JSValue, std::__1::span<JSC::JSValue const, 18446744073709551615ul>)","symbolLocation":472,"imageIndex":33},{"imageOffset":20353828,"symbol":"JSC::VM::drainMicrotasks()","symbolLocation":508,"imageIndex":33},{"imageOffset":17727972,"symbol":"JSC::JSLock::willReleaseLock()","symbolLocation":140,"imageIndex":33},{"imageOffset":51564,"symbol":"JSC::JSLockHolder::~JSLockHolder()","symbolLocation":128,"imageIndex":33},{"imageOffset":1195144,"symbol":"-[JSValue callWithArguments:]","symbolLocation":456,"imageIndex":33},{"imageOffset":11077528,"imageIndex":0},{"imageOffset":375740,"symbol":"___forwarding___","symbolLocation":956,"imageIndex":31},{"imageOffset":374592,"symbol":"_CF_forwarding_prep_0","symbolLocation":96,"imageIndex":31},{"imageOffset":1840308,"imageIndex":0},{"imageOffset":464428,"symbol":"__CFNOTIFICATIONCENTER_IS_CALLING_OUT_TO_AN_OBSERVER__","symbolLocation":148,"imageIndex":31},{"imageOffset":1051880,"symbol":"___CFXRegistrationPost_block_invoke","symbolLocation":92,"imageIndex":31},{"imageOffset":1051692,"symbol":"_CFXRegistrationPost","symbolLocation":436,"imageIndex":31},{"imageOffset":264824,"symbol":"_CFXNotificationPost","symbolLocation":740,"imageIndex":31},{"imageOffset":38528,"symbol":"-[NSNotificationCenter postNotificationName:object:userInfo:]","symbolLocation":88,"imageIndex":32},{"imageOffset":1909640,"imageIndex":0},{"imageOffset":8861108,"imageIndex":0},{"imageOffset":10614944,"imageIndex":0},{"imageOffset":5571588,"symbol":"-[UIAlertController _invokeHandlersForAction:]","symbolLocation":88,"imageIndex":34},{"imageOffset":5573684,"symbol":"__103-[UIAlertController _dismissAnimated:triggeringAction:triggeredByPopoverDimmingView:dismissCompletion:]_block_invoke_2","symbolLocation":36,"imageIndex":34},{"imageOffset":642140,"symbol":"-[UIPresentationController transitionDidFinish:]","symbolLocation":824,"imageIndex":34},{"imageOffset":8665836,"symbol":"__77-[UIPresentationController runTransitionForCurrentStateAnimated:handoffData:]_block_invoke.112","symbolLocation":344,"imageIndex":34},{"imageOffset":641152,"symbol":"-[_UIViewControllerTransitionContext completeTransition:]","symbolLocation":192,"imageIndex":34},{"imageOffset":21156572,"symbol":"__UIVIEW_IS_EXECUTING_ANIMATION_COMPLETION_BLOCK__","symbolLocation":36,"imageIndex":34},{"imageOffset":651612,"symbol":"-[UIViewAnimationBlockDelegate _didEndBlockAnimation:finished:context:]","symbolLocation":628,"imageIndex":34},{"imageOffset":650412,"symbol":"-[UIViewAnimationState sendDelegateAnimationDidStop:finished:]","symbolLocation":436,"imageIndex":34},{"imageOffset":1248388,"symbol":"-[UIViewAnimationState animationDidStop:finished:]","symbolLocation":192,"imageIndex":34},{"imageOffset":1443584,"symbol":"-[UIViewAnimationStateAccessibility animationDidStop:finished:]","symbolLocation":252,"imageIndex":35},{"imageOffset":1248500,"symbol":"-[UIViewAnimationState animationDidStop:finished:]","symbolLocation":304,"imageIndex":34},{"imageOffset":1443584,"symbol":"-[UIViewAnimationStateAccessibility animationDidStop:finished:]","symbolLocation":252,"imageIndex":35},{"imageOffset":2589864,"symbol":"run_animation_callbacks(void*)","symbolLocation":132,"imageIndex":36},{"imageOffset":112732,"symbol":"_dispatch_client_callout","symbolLocation":16,"imageIndex":37},{"imageOffset":232280,"symbol":"_dispatch_main_queue_drain.cold.5","symbolLocation":812,"imageIndex":37},{"imageOffset":69040,"symbol":"_dispatch_main_queue_drain","symbolLocation":180,"imageIndex":37},{"imageOffset":68844,"symbol":"_dispatch_main_queue_callback_4CF","symbolLocation":44,"imageIndex":37},{"imageOffset":765348,"symbol":"__CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__","symbolLocation":16,"imageIndex":31},{"imageOffset":506524,"symbol":"__CFRunLoopRun","symbolLocation":1980,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":799356,"symbol":"RunCurrentEventLoopInMode","symbolLocation":324,"imageIndex":38},{"imageOffset":812264,"symbol":"ReceiveNextEventCommon","symbolLocation":676,"imageIndex":38},{"imageOffset":2430084,"symbol":"_BlockUntilNextEventMatchingListInModeWithFilter","symbolLocation":76,"imageIndex":38},{"imageOffset":240308,"symbol":"_DPSNextEvent","symbolLocation":684,"imageIndex":39},{"imageOffset":10327472,"symbol":"-[NSApplication(NSEventRouting) _nextEventMatchingEventMask:untilDate:inMode:dequeue:]","symbolLocation":688,"imageIndex":39},{"imageOffset":187492,"symbol":"-[NSApplication run]","symbolLocation":480,"imageIndex":39},{"imageOffset":17244,"symbol":"NSApplicationMain","symbolLocation":880,"imageIndex":39},{"imageOffset":2428148,"symbol":"_NSApplicationMainWithInfoDictionary","symbolLocation":24,"imageIndex":39},{"imageOffset":16740,"symbol":"UINSApplicationMain","symbolLocation":976,"imageIndex":40},{"imageOffset":15516,"symbol":"UIApplicationMain","symbolLocation":148,"imageIndex":34},{"imageOffset":5913624,"imageIndex":0},{"imageOffset":27544,"symbol":"start","symbolLocation":6076,"imageIndex":41}]},{"id":9929155,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6135640064},{"value":5891},{"value":6135103488},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6135640064},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929156,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6136213504},{"value":4611},{"value":6135676928},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6136213504},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929159,"threadState":{"x":[{"value":18446744073709551612},{"value":0},{"value":4294967295},{"value":0},{"value":8595888768,"symbolLocation":0,"symbol":"_dispatch_main_q"},{"value":18},{"value":6528},{"value":0},{"value":0},{"value":105553148058192},{"value":8595888872,"symbolLocation":104,"symbol":"_dispatch_main_q"},{"value":5},{"value":105553148058182},{"value":8595888816,"symbolLocation":48,"symbol":"_dispatch_main_q"},{"value":0},{"value":105553148058182},{"value":515},{"value":8612978760},{"value":0},{"value":4294967295},{"value":1},{"value":0},{"value":6136784720},{"value":6136784880},{"value":105553139195072},{"value":6749720576},{"value":0},{"value":5377134648},{"value":9223372036876455883}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6747475132},"cpsr":{"value":1073745920},"fp":{"value":6136784528},"sp":{"value":6136784496},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749006264},"far":{"value":0}},"queue":"com.apple.libtrace.state.block-list","frames":[{"imageOffset":10680,"symbol":"__ulock_wait","symbolLocation":8,"imageIndex":26},{"imageOffset":15548,"symbol":"_dlock_wait","symbolLocation":56,"imageIndex":37},{"imageOffset":15068,"symbol":"_dispatch_thread_event_wait_slow","symbolLocation":56,"imageIndex":37},{"imageOffset":72328,"symbol":"__DISPATCH_WAIT_FOR_QUEUE__","symbolLocation":368,"imageIndex":37},{"imageOffset":71232,"symbol":"_dispatch_sync_f_slow","symbolLocation":148,"imageIndex":37},{"imageOffset":47016,"symbol":"___os_state_request_for_self_block_invoke","symbolLocation":372,"imageIndex":43},{"imageOffset":6956,"symbol":"_dispatch_call_block_and_release","symbolLocation":32,"imageIndex":37},{"imageOffset":112732,"symbol":"_dispatch_client_callout","symbolLocation":16,"imageIndex":37},{"imageOffset":41808,"symbol":"_dispatch_lane_serial_drain","symbolLocation":740,"imageIndex":37},{"imageOffset":44640,"symbol":"_dispatch_lane_invoke","symbolLocation":440,"imageIndex":37},{"imageOffset":86628,"symbol":"_dispatch_root_queue_drain_deferred_wlh","symbolLocation":292,"imageIndex":37},{"imageOffset":84712,"symbol":"_dispatch_workloop_worker_thread","symbolLocation":540,"imageIndex":37},{"imageOffset":11876,"symbol":"_pthread_wqthread","symbolLocation":292,"imageIndex":27},{"imageOffset":7028,"symbol":"start_wqthread","symbolLocation":8,"imageIndex":27}]},{"id":9929163,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6137360384},{"value":32011},{"value":6136823808},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6137360384},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929164,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6137933824},{"value":22531},{"value":6137397248},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6137933824},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929166,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6139080704},{"value":23043},{"value":6138544128},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6139080704},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929168,"name":"com.apple.uikit.eventfetch-thread","threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":129755256979456},{"value":0},{"value":129755256979456},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":30211},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":129755256979456},{"value":0},{"value":129755256979456},{"value":6139649432},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6139649280},"sp":{"value":6139649200},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":840612,"symbol":"-[NSRunLoop(NSRunLoop) runUntilDate:]","symbolLocation":100,"imageIndex":32},{"imageOffset":20592,"symbol":"-[UIEventFetcher threadMain]","symbolLocation":104,"imageIndex":34},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929172,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6140227584},{"value":29195},{"value":6139691008},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6140227584},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929178,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6140801024},{"value":33795},{"value":6140264448},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6140801024},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929180,"name":"com.google.firebase.crashlytics.MachExceptionServer","threadState":{"x":[{"value":268451845},{"value":17179869190},{"value":0},{"value":0},{"value":0},{"value":149546466279424},{"value":92},{"value":0},{"value":0},{"value":17179869184},{"value":92},{"value":0},{"value":0},{"value":0},{"value":34819},{"value":0},{"value":18446744073709551569},{"value":8612987176},{"value":0},{"value":0},{"value":92},{"value":149546466279424},{"value":0},{"value":0},{"value":4447616720},{"value":0},{"value":17179869190},{"value":18446744073709550527},{"value":6}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":4447616336},"sp":{"value":4447616256},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":101992,"symbol":"FIRCLSMachExceptionServer","symbolLocation":104,"imageIndex":5},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929188,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6141964288},{"value":34055},{"value":6141427712},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6141964288},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929194,"threadState":{"x":[{"value":0},{"value":17297326606},{"value":0},{"value":36867},{"value":0},{"value":278189326729216},{"value":16384},{"value":0},{"value":0},{"value":17179869184},{"value":16384},{"value":0},{"value":0},{"value":0},{"value":64771},{"value":1},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":0},{"value":16384},{"value":278189326729216},{"value":0},{"value":36867},{"value":6142517792},{"value":0},{"value":17297326606},{"value":18446744073709550527},{"value":117457422}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6142517456},"sp":{"value":6142517376},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"queue":"CSBackupSetItemExcluded() Spotlight Queue","frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":118456,"symbol":"_dispatch_mach_send_and_wait_for_reply","symbolLocation":548,"imageIndex":37},{"imageOffset":119384,"symbol":"dispatch_mach_send_with_result_and_wait_for_reply","symbolLocation":60,"imageIndex":37},{"imageOffset":50280,"symbol":"xpc_connection_send_message_with_reply_sync","symbolLocation":284,"imageIndex":44},{"imageOffset":7460,"symbol":"_itemsForPathsBulk","symbolLocation":104,"imageIndex":45},{"imageOffset":6528,"symbol":"MDItemCreate","symbolLocation":660,"imageIndex":45},{"imageOffset":729416,"symbol":"__SetURLExcluded_block_invoke_2","symbolLocation":120,"imageIndex":46},{"imageOffset":6956,"symbol":"_dispatch_call_block_and_release","symbolLocation":32,"imageIndex":37},{"imageOffset":112732,"symbol":"_dispatch_client_callout","symbolLocation":16,"imageIndex":37},{"imageOffset":41808,"symbol":"_dispatch_lane_serial_drain","symbolLocation":740,"imageIndex":37},{"imageOffset":44640,"symbol":"_dispatch_lane_invoke","symbolLocation":440,"imageIndex":37},{"imageOffset":86628,"symbol":"_dispatch_root_queue_drain_deferred_wlh","symbolLocation":292,"imageIndex":37},{"imageOffset":84712,"symbol":"_dispatch_workloop_worker_thread","symbolLocation":540,"imageIndex":37},{"imageOffset":11876,"symbol":"_pthread_wqthread","symbolLocation":292,"imageIndex":27},{"imageOffset":7028,"symbol":"start_wqthread","symbolLocation":8,"imageIndex":27}]},{"id":9929199,"frames":[{"imageOffset":7020,"symbol":"start_wqthread","symbolLocation":0,"imageIndex":27}],"threadState":{"x":[{"value":6143111168},{"value":64515},{"value":6142574592},{"value":0},{"value":409604},{"value":18446744073709551615},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":0},"cpsr":{"value":4096},"fp":{"value":0},"sp":{"value":6143111168},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749248364},"far":{"value":0}}},{"id":9929239,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":370548303462400},{"value":0},{"value":370548303462400},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":86275},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":370548303462400},{"value":0},{"value":370548303462400},{"value":6143679928},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6143679776},"sp":{"value":6143679696},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929240,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":363951233695744},{"value":0},{"value":363951233695744},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":84739},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":363951233695744},{"value":0},{"value":363951233695744},{"value":6144253368},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6144253216},"sp":{"value":6144253136},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929241,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":289184443006976},{"value":0},{"value":289184443006976},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":67331},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":289184443006976},{"value":0},{"value":289184443006976},{"value":6144826808},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6144826656},"sp":{"value":6144826576},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929242,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":296881024401408},{"value":0},{"value":296881024401408},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":69123},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":296881024401408},{"value":0},{"value":296881024401408},{"value":6145400248},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6145400096},"sp":{"value":6145400016},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929243,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":360652698812416},{"value":0},{"value":360652698812416},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":83971},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":360652698812416},{"value":0},{"value":360652698812416},{"value":6145973688},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6145973536},"sp":{"value":6145973456},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929244,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":304577605795840},{"value":0},{"value":304577605795840},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":70915},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":304577605795840},{"value":0},{"value":304577605795840},{"value":6146547128},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6146546976},"sp":{"value":6146546896},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929245,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":352956117417984},{"value":0},{"value":352956117417984},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":82179},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":352956117417984},{"value":0},{"value":352956117417984},{"value":6147120568},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6147120416},"sp":{"value":6147120336},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929246,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":347458559279104},{"value":0},{"value":347458559279104},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":80899},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":347458559279104},{"value":0},{"value":347458559279104},{"value":6147694008},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6147693856},"sp":{"value":6147693776},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929247,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":310075163934720},{"value":0},{"value":310075163934720},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":72195},{"value":2043},{"value":18446744073709551569},{"value":8612987104},{"value":0},{"value":4294967295},{"value":2},{"value":310075163934720},{"value":0},{"value":310075163934720},{"value":6148267448},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6148267296},"sp":{"value":6148267216},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929251,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":11144608,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":336463443001344},{"value":0},{"value":336463443001344},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":78339},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":336463443001344},{"value":0},{"value":336463443001344},{"value":6148840872},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6148840720},"sp":{"value":6148840640},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929280,"name":"com.apple.NSURLConnectionLoader","threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":424441553092608},{"value":0},{"value":424441553092608},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":98823},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":424441553092608},{"value":0},{"value":424441553092608},{"value":6149414216},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6149414064},"sp":{"value":6149413984},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":2443500,"symbol":"+[__CFN_CoreSchedulingSetRunnable _run:]","symbolLocation":416,"imageIndex":47},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929293,"name":"AXSpeech","threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":439817536012288},{"value":0},{"value":439817536012288},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":102403},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":439817536012288},{"value":0},{"value":439817536012288},{"value":6149987768},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6149987616},"sp":{"value":6149987536},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":196064,"imageIndex":48},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929295,"name":"JavaScriptCore libpas scavenger","threadState":{"x":[{"value":260},{"value":0},{"value":11008},{"value":0},{"value":0},{"value":160},{"value":0},{"value":100000008},{"value":6150565544},{"value":0},{"value":0},{"value":2},{"value":2},{"value":0},{"value":0},{"value":0},{"value":305},{"value":8612978528},{"value":0},{"value":12884961344},{"value":12884961408},{"value":6150566112},{"value":100000008},{"value":0},{"value":11008},{"value":13569},{"value":13824},{"value":4652007308841189376},{"value":8577081344,"symbolLocation":1004,"symbol":"jit_common_primitive_heap_support"}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749270240},"cpsr":{"value":1610616832},"fp":{"value":6150565664},"sp":{"value":6150565520},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749012940},"far":{"value":0}},"frames":[{"imageOffset":17356,"symbol":"__psynch_cvwait","symbolLocation":8,"imageIndex":26},{"imageOffset":28896,"symbol":"_pthread_cond_wait","symbolLocation":984,"imageIndex":27},{"imageOffset":24913416,"symbol":"scavenger_thread_main","symbolLocation":1356,"imageIndex":33},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929322,"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":367736,"symbol":"-[NSRunLoop(NSRunLoop) runMode:beforeDate:]","symbolLocation":212,"imageIndex":32},{"imageOffset":8199068,"imageIndex":0},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}],"threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":649824256917504},{"value":0},{"value":649824256917504},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":151299},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":649824256917504},{"value":0},{"value":649824256917504},{"value":6151134648},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6151134496},"sp":{"value":6151134416},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}}},{"id":9929373,"name":"com.apple.NSEventThread","threadState":{"x":[{"value":268451845},{"value":21592279046},{"value":8589934592},{"value":1121549104971776},{"value":0},{"value":1121549104971776},{"value":2},{"value":4294967295},{"value":0},{"value":17179869184},{"value":0},{"value":2},{"value":0},{"value":0},{"value":261131},{"value":0},{"value":18446744073709551569},{"value":8612980408},{"value":0},{"value":4294967295},{"value":2},{"value":1121549104971776},{"value":0},{"value":1121549104971776},{"value":6151708808},{"value":8589934592},{"value":21592279046},{"value":18446744073709550527},{"value":4412409862}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":4096},"fp":{"value":6151708656},"sp":{"value":6151708576},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":38756,"symbol":"mach_msg_overwrite","symbolLocation":484,"imageIndex":26},{"imageOffset":4008,"symbol":"mach_msg","symbolLocation":24,"imageIndex":26},{"imageOffset":511612,"symbol":"__CFRunLoopServiceMachPort","symbolLocation":160,"imageIndex":31},{"imageOffset":505752,"symbol":"__CFRunLoopRun","symbolLocation":1208,"imageIndex":31},{"imageOffset":502872,"symbol":"CFRunLoopRunSpecific","symbolLocation":572,"imageIndex":31},{"imageOffset":1435644,"symbol":"_NSEventThread","symbolLocation":140,"imageIndex":39},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929624,"name":"Heap Helper Thread","threadState":{"x":[{"value":260},{"value":0},{"value":53248},{"value":0},{"value":0},{"value":160},{"value":10},{"value":36},{"value":6138506488},{"value":0},{"value":512},{"value":2199023256066},{"value":2199023256066},{"value":512},{"value":0},{"value":2199023256064},{"value":305},{"value":8612978528},{"value":0},{"value":5420892400},{"value":5420892464},{"value":6138507488},{"value":36},{"value":10},{"value":53248},{"value":53249},{"value":53504},{"value":8577098608,"symbolLocation":40,"symbol":"_MergedGlobals"},{"value":8576948664,"symbolLocation":0,"symbol":"bmalloc_megapage_table"}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749270240},"cpsr":{"value":1610616832},"fp":{"value":6138506608},"sp":{"value":6138506464},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749012940},"far":{"value":0}},"frames":[{"imageOffset":17356,"symbol":"__psynch_cvwait","symbolLocation":8,"imageIndex":26},{"imageOffset":28896,"symbol":"_pthread_cond_wait","symbolLocation":984,"imageIndex":27},{"imageOffset":1960032,"symbol":"WTF::ThreadCondition::timedWait(WTF::Mutex&, WTF::WallTime)","symbolLocation":240,"imageIndex":33},{"imageOffset":1681580,"symbol":"WTF::ParkingLot::parkConditionallyImpl(void const*, WTF::ScopedLambda<bool ()> const&, WTF::ScopedLambda<void ()> const&, WTF::TimeWithDynamicClockType const&)","symbolLocation":1916,"imageIndex":33},{"imageOffset":1388476,"symbol":"WTF::Detail::CallableWrapper<WTF::AutomaticThread::start(WTF::AbstractLocker const&)::$_0, void>::call()","symbolLocation":472,"imageIndex":33},{"imageOffset":1948416,"symbol":"WTF::Thread::entryPoint(WTF::Thread::NewThreadContext*)","symbolLocation":348,"imageIndex":33},{"imageOffset":39356,"symbol":"WTF::wtfThreadEntryPoint(void*)","symbolLocation":16,"imageIndex":33},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929625,"name":"Heap Helper Thread","threadState":{"x":[{"value":260},{"value":0},{"value":69120},{"value":0},{"value":0},{"value":160},{"value":9},{"value":999998751},{"value":6141373688},{"value":0},{"value":0},{"value":2},{"value":2},{"value":0},{"value":0},{"value":0},{"value":305},{"value":8612978528},{"value":0},{"value":5421007088},{"value":5421007152},{"value":6141374688},{"value":999998751},{"value":9},{"value":69120},{"value":69121},{"value":69376},{"value":8577098608,"symbolLocation":40,"symbol":"_MergedGlobals"},{"value":8576948664,"symbolLocation":0,"symbol":"bmalloc_megapage_table"}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749270240},"cpsr":{"value":1610616832},"fp":{"value":6141373808},"sp":{"value":6141373664},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749012940},"far":{"value":0}},"frames":[{"imageOffset":17356,"symbol":"__psynch_cvwait","symbolLocation":8,"imageIndex":26},{"imageOffset":28896,"symbol":"_pthread_cond_wait","symbolLocation":984,"imageIndex":27},{"imageOffset":1960032,"symbol":"WTF::ThreadCondition::timedWait(WTF::Mutex&, WTF::WallTime)","symbolLocation":240,"imageIndex":33},{"imageOffset":1681580,"symbol":"WTF::ParkingLot::parkConditionallyImpl(void const*, WTF::ScopedLambda<bool ()> const&, WTF::ScopedLambda<void ()> const&, WTF::TimeWithDynamicClockType const&)","symbolLocation":1916,"imageIndex":33},{"imageOffset":1388476,"symbol":"WTF::Detail::CallableWrapper<WTF::AutomaticThread::start(WTF::AbstractLocker const&)::$_0, void>::call()","symbolLocation":472,"imageIndex":33},{"imageOffset":1948416,"symbol":"WTF::Thread::entryPoint(WTF::Thread::NewThreadContext*)","symbolLocation":348,"imageIndex":33},{"imageOffset":39356,"symbol":"WTF::wtfThreadEntryPoint(void*)","symbolLocation":16,"imageIndex":33},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929626,"name":"Heap Helper Thread","threadState":{"x":[{"value":260},{"value":0},{"value":66816},{"value":0},{"value":0},{"value":160},{"value":9},{"value":999999652},{"value":6152285432},{"value":0},{"value":0},{"value":2},{"value":2},{"value":0},{"value":0},{"value":0},{"value":305},{"value":8612978528},{"value":0},{"value":5420941552},{"value":5420941616},{"value":6152286432},{"value":999999652},{"value":9},{"value":66816},{"value":66817},{"value":67072},{"value":8577098608,"symbolLocation":40,"symbol":"_MergedGlobals"},{"value":8576948664,"symbolLocation":0,"symbol":"bmalloc_megapage_table"}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749270240},"cpsr":{"value":1610616832},"fp":{"value":6152285552},"sp":{"value":6152285408},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6749012940},"far":{"value":0}},"frames":[{"imageOffset":17356,"symbol":"__psynch_cvwait","symbolLocation":8,"imageIndex":26},{"imageOffset":28896,"symbol":"_pthread_cond_wait","symbolLocation":984,"imageIndex":27},{"imageOffset":1960032,"symbol":"WTF::ThreadCondition::timedWait(WTF::Mutex&, WTF::WallTime)","symbolLocation":240,"imageIndex":33},{"imageOffset":1681580,"symbol":"WTF::ParkingLot::parkConditionallyImpl(void const*, WTF::ScopedLambda<bool ()> const&, WTF::ScopedLambda<void ()> const&, WTF::TimeWithDynamicClockType const&)","symbolLocation":1916,"imageIndex":33},{"imageOffset":1388476,"symbol":"WTF::Detail::CallableWrapper<WTF::AutomaticThread::start(WTF::AbstractLocker const&)::$_0, void>::call()","symbolLocation":472,"imageIndex":33},{"imageOffset":1948416,"symbol":"WTF::Thread::entryPoint(WTF::Thread::NewThreadContext*)","symbolLocation":348,"imageIndex":33},{"imageOffset":39356,"symbol":"WTF::wtfThreadEntryPoint(void*)","symbolLocation":16,"imageIndex":33},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]},{"id":9929669,"name":"HIE: M_ f47dd3624b273bb8 2025-07-04 17:35:36.022","threadState":{"x":[{"value":0},{"value":8589934595},{"value":103079220499},{"value":1019294523786267},{"value":15483357102080},{"value":1019294523588608},{"value":44},{"value":0},{"value":6749208576,"symbolLocation":40,"symbol":"mach_voucher_debug_info"},{"value":1},{"value":105553359603045},{"value":15},{"value":13},{"value":105553180022944},{"value":8595880088,"symbolLocation":0,"symbol":"_NSConcreteMallocBlock"},{"value":8595880088,"symbolLocation":0,"symbol":"_NSConcreteMallocBlock"},{"value":18446744073709551569},{"value":8612983544},{"value":0},{"value":0},{"value":44},{"value":1019294523588608},{"value":15483357102080},{"value":1019294523786267},{"value":6152858896},{"value":103079220499},{"value":8589934595},{"value":18446744073709550527},{"value":0}],"flavor":"ARM_THREAD_STATE64","lr":{"value":6749074336},"cpsr":{"value":2147487744},"fp":{"value":6152858880},"sp":{"value":6152858800},"esr":{"value":1442840704,"description":" Address size fault"},"pc":{"value":6748998708},"far":{"value":0}},"frames":[{"imageOffset":3124,"symbol":"mach_msg2_trap","symbolLocation":8,"imageIndex":26},{"imageOffset":78752,"symbol":"mach_msg2_internal","symbolLocation":76,"imageIndex":26},{"imageOffset":198788,"symbol":"thread_suspend","symbolLocation":108,"imageIndex":26},{"imageOffset":222468,"symbol":"SOME_OTHER_THREAD_SWALLOWED_AT_LEAST_ONE_EXCEPTION","symbolLocation":20,"imageIndex":49},{"imageOffset":342952,"symbol":"__NSThread__start__","symbolLocation":732,"imageIndex":32},{"imageOffset":27660,"symbol":"_pthread_start","symbolLocation":136,"imageIndex":27},{"imageOffset":7040,"symbol":"thread_start","symbolLocation":8,"imageIndex":27}]}],
  "usedImages" : [
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4331798528,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "QReader.MarginStudy.easy",
    "size" : 24100864,
    "uuid" : "b40e9e56-02af-3524-979b-d73066c84858",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/MacOS\/MarginNote 4",
    "name" : "MarginNote 4",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4361306112,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FBLPromises",
    "size" : 49152,
    "uuid" : "f86ae958-11fb-3f3e-b00e-69b4314260a3",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FBLPromises.framework\/Versions\/A\/FBLPromises",
    "name" : "FBLPromises",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4360962048,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseCore",
    "size" : 65536,
    "uuid" : "0fd06fca-acba-36f4-84f0-56fcaf80928d",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseCore.framework\/Versions\/A\/FirebaseCore",
    "name" : "FirebaseCore",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4361486336,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseCoreExtension",
    "size" : 16384,
    "uuid" : "77705319-160e-31e4-b17b-15939a5040fb",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseCoreExtension.framework\/Versions\/A\/FirebaseCoreExtension",
    "name" : "FirebaseCoreExtension",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4362256384,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseCoreInternal",
    "size" : 98304,
    "uuid" : "71083897-cb75-37ee-a6e4-25ab28d8d7cf",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseCoreInternal.framework\/Versions\/A\/FirebaseCoreInternal",
    "name" : "FirebaseCoreInternal",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4365402112,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseCrashlytics",
    "size" : 327680,
    "uuid" : "deb4d0e3-c011-30ef-942b-bd8200ba9904",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseCrashlytics.framework\/Versions\/A\/FirebaseCrashlytics",
    "name" : "FirebaseCrashlytics",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4362600448,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseInstallations",
    "size" : 81920,
    "uuid" : "d805f230-947f-32d0-bb26-acbf411fef75",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseInstallations.framework\/Versions\/A\/FirebaseInstallations",
    "name" : "FirebaseInstallations",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4361158656,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseRemoteConfigInterop",
    "size" : 32768,
    "uuid" : "d8a2884f-2cd7-3357-8b94-95f49042cc09",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseRemoteConfigInterop.framework\/Versions\/A\/FirebaseRemoteConfigInterop",
    "name" : "FirebaseRemoteConfigInterop",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4361568256,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.FirebaseSessions",
    "size" : 114688,
    "uuid" : "bb07366d-d78f-3a56-9faf-3f6c768ce485",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/FirebaseSessions.framework\/Versions\/A\/FirebaseSessions",
    "name" : "FirebaseSessions",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4363616256,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.GoogleDataTransport",
    "size" : 147456,
    "uuid" : "7cc021c1-d9a0-3efa-8a21-5a8bcc77d91b",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/GoogleDataTransport.framework\/Versions\/A\/GoogleDataTransport",
    "name" : "GoogleDataTransport",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4361928704,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.GoogleUtilities",
    "size" : 98304,
    "uuid" : "b670133a-a885-3b47-8613-a88a46786ac6",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/GoogleUtilities.framework\/Versions\/A\/GoogleUtilities",
    "name" : "GoogleUtilities",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4363272192,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.Promises",
    "size" : 65536,
    "uuid" : "06183135-4de9-3613-9417-880174d9a750",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/Promises.framework\/Versions\/A\/Promises",
    "name" : "Promises",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4363010048,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.nanopb",
    "size" : 16384,
    "uuid" : "f94825bf-33e5-3ae1-a298-64e453c53671",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/nanopb.framework\/Versions\/A\/nanopb",
    "name" : "nanopb",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4366254080,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "com.downMarkdown.Down",
    "size" : 278528,
    "uuid" : "0df0b467-46e7-3c9b-9a5f-9c4f20a14451",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/Down.framework\/Versions\/A\/Down",
    "name" : "Down",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4363091968,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "com.ziparchive.ZipArchive",
    "size" : 81920,
    "uuid" : "1984df90-69be-30ea-b3f1-318feef4746b",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/ZipArchive.framework\/Versions\/A\/ZipArchive",
    "name" : "ZipArchive",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4362846208,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "org.cocoapods.ConcaveHull",
    "size" : 49152,
    "uuid" : "fd9a4b3d-7c7d-3288-a531-23d30992e2da",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/ConcaveHull.framework\/Versions\/A\/ConcaveHull",
    "name" : "ConcaveHull",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4369940480,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "com.Tencent.WCDB",
    "size" : 1327104,
    "uuid" : "3d4d4dd8-0803-301e-8ec6-fdab287520b8",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/WCDB.framework\/Versions\/A\/WCDB",
    "name" : "WCDB",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4364009472,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "com.mixpanel.Mixpanel",
    "size" : 327680,
    "uuid" : "f1855e19-2b40-3376-9e34-d887bed9d0c4",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/Mixpanel.framework\/Versions\/A\/Mixpanel",
    "name" : "Mixpanel",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4368121856,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "com.uservoice.UserVoiceSDK",
    "size" : 311296,
    "uuid" : "05a04b59-c1da-3aa5-8a8b-0ad8f2e7fdcc",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/UserVoice.framework\/Versions\/A\/UserVoice",
    "name" : "UserVoice",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4366729216,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "QReader.S.Swinject",
    "size" : 65536,
    "uuid" : "70e9d0fe-1c46-3909-9545-64e3b672966f",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/Swinject.framework\/Versions\/A\/Swinject",
    "name" : "Swinject",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4363485184,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "QReader.S.AsyncSwift",
    "size" : 32768,
    "uuid" : "04fb0895-6947-3860-a35f-b0d8ee65b61d",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/Async.framework\/Versions\/A\/Async",
    "name" : "Async",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4364697600,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "QReader.S.EVReflection",
    "size" : 163840,
    "uuid" : "6dfd4d18-f59b-39ba-bc8f-371d8d8578a8",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/EVReflection.framework\/Versions\/A\/EVReflection",
    "name" : "EVReflection",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64",
    "base" : 4368826368,
    "CFBundleShortVersionString" : "4.2.0",
    "CFBundleIdentifier" : "QReader.S.Alamofire",
    "size" : 344064,
    "uuid" : "14f0248c-6524-3c71-bfb0-c4e623c3e32c",
    "path" : "\/Applications\/MarginNote 4.app\/Contents\/Frameworks\/Alamofire.framework\/Versions\/A\/Alamofire",
    "name" : "Alamofire",
    "CFBundleVersion" : "20016"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 4367663104,
    "size" : 49152,
    "uuid" : "d02a05cb-6440-3e7e-a02f-931734cab666",
    "path" : "\/usr\/lib\/libobjc-trampolines.dylib",
    "name" : "libobjc-trampolines.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 4507893760,
    "CFBundleShortVersionString" : "327.5",
    "CFBundleIdentifier" : "com.apple.AGXMetal13-3",
    "size" : 6897664,
    "uuid" : "bea42a86-a627-3c22-8eec-738c406242ff",
    "path" : "\/System\/Library\/Extensions\/AGXMetal13_3.bundle\/Contents\/MacOS\/AGXMetal13_3",
    "name" : "AGXMetal13_3",
    "CFBundleVersion" : "327.5"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 4959109120,
    "CFBundleShortVersionString" : "1.0",
    "CFBundleIdentifier" : "com.apple.UIKitMacHelper.axbundle",
    "size" : 49152,
    "uuid" : "4203490e-bc3b-33a0-90ba-867563425439",
    "path" : "\/System\/Library\/Accessibility\/BundlesBase\/com.apple.UIKitMacHelper.axbundle\/Versions\/A\/com.apple.UIKitMacHelper",
    "name" : "com.apple.UIKitMacHelper",
    "CFBundleVersion" : "287.6.4"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6748995584,
    "size" : 243284,
    "uuid" : "60485b6f-67e5-38c1-aec9-efd6031ff166",
    "path" : "\/usr\/lib\/system\/libsystem_kernel.dylib",
    "name" : "libsystem_kernel.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6749241344,
    "size" : 51784,
    "uuid" : "647b91fc-96d3-3bbb-af08-970df45257c8",
    "path" : "\/usr\/lib\/system\/libsystem_pthread.dylib",
    "name" : "libsystem_pthread.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6747762688,
    "size" : 529520,
    "uuid" : "f4529d5e-24f3-3bbb-bd3c-984856875fc8",
    "path" : "\/usr\/lib\/system\/libsystem_c.dylib",
    "name" : "libsystem_c.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6748872704,
    "size" : 122880,
    "uuid" : "4db4ac5c-e091-3a2e-a149-b7955b8af852",
    "path" : "\/usr\/lib\/libc++abi.dylib",
    "name" : "libc++abi.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6745096192,
    "size" : 342164,
    "uuid" : "4966864d-c147-33d3-bb18-1e3979590b6d",
    "path" : "\/usr\/lib\/libobjc.A.dylib",
    "name" : "libobjc.A.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6749720576,
    "CFBundleShortVersionString" : "6.9",
    "CFBundleIdentifier" : "com.apple.CoreFoundation",
    "size" : 5500928,
    "uuid" : "df489a59-b4f6-32b8-9bb4-9b832960aa52",
    "path" : "\/System\/Library\/Frameworks\/CoreFoundation.framework\/Versions\/A\/CoreFoundation",
    "name" : "CoreFoundation",
    "CFBundleVersion" : "3502.1.401"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6772723712,
    "CFBundleShortVersionString" : "6.9",
    "CFBundleIdentifier" : "com.apple.Foundation",
    "size" : 14586624,
    "uuid" : "e8f6a451-0acc-3e05-b18f-fec6618ce44a",
    "path" : "\/System\/Library\/Frameworks\/Foundation.framework\/Versions\/C\/Foundation",
    "name" : "Foundation",
    "CFBundleVersion" : "3502.1.401"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 7979130880,
    "CFBundleShortVersionString" : "20621",
    "CFBundleIdentifier" : "com.apple.JavaScriptCore",
    "size" : 27061440,
    "uuid" : "2a97bf13-e372-380e-a1d4-177c2d81af46",
    "path" : "\/System\/iOSSupport\/System\/Library\/Frameworks\/JavaScriptCore.framework\/Versions\/A\/JavaScriptCore",
    "name" : "JavaScriptCore",
    "CFBundleVersion" : "20621.2.5.11.8"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 7618002944,
    "CFBundleShortVersionString" : "1.0",
    "CFBundleIdentifier" : "com.apple.UIKitCore",
    "size" : 31017472,
    "uuid" : "9bac5042-7dbf-39da-8726-3fa7d5e88098",
    "path" : "\/System\/iOSSupport\/System\/Library\/PrivateFrameworks\/UIKitCore.framework\/Versions\/A\/UIKitCore",
    "name" : "UIKitCore",
    "CFBundleVersion" : "8506"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 10691047424,
    "CFBundleShortVersionString" : "1.0.0",
    "CFBundleIdentifier" : "com.apple.UIKit.axbundle",
    "size" : 2041632,
    "uuid" : "6ef52093-a61b-373e-8aae-7827422db827",
    "path" : "\/System\/iOSSupport\/System\/Library\/AccessibilityBundles\/UIKit.axbundle\/Contents\/MacOS\/UIKit",
    "name" : "UIKit",
    "CFBundleVersion" : "1.0"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6901551104,
    "CFBundleShortVersionString" : "1.11",
    "CFBundleIdentifier" : "com.apple.QuartzCore",
    "size" : 4013184,
    "uuid" : "e0d9f378-dc87-33f8-93a5-3c62ad30ea19",
    "path" : "\/System\/Library\/Frameworks\/QuartzCore.framework\/Versions\/A\/QuartzCore",
    "name" : "QuartzCore",
    "CFBundleVersion" : "1156.18"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6747459584,
    "size" : 288576,
    "uuid" : "8bf83cda-8db1-3d46-94b0-d811bd77e078",
    "path" : "\/usr\/lib\/system\/libdispatch.dylib",
    "name" : "libdispatch.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6945067008,
    "CFBundleShortVersionString" : "2.1.1",
    "CFBundleIdentifier" : "com.apple.HIToolbox",
    "size" : 3174368,
    "uuid" : "9286e29f-fcee-31d0-acea-2842ea23bedf",
    "path" : "\/System\/Library\/Frameworks\/Carbon.framework\/Versions\/A\/Frameworks\/HIToolbox.framework\/Versions\/A\/HIToolbox",
    "name" : "HIToolbox"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6816206848,
    "CFBundleShortVersionString" : "6.9",
    "CFBundleIdentifier" : "com.apple.AppKit",
    "size" : 21568640,
    "uuid" : "5d0da1bd-412c-3ed8-84e9-40ca62fe7b42",
    "path" : "\/System\/Library\/Frameworks\/AppKit.framework\/Versions\/C\/AppKit",
    "name" : "AppKit",
    "CFBundleVersion" : "2575.60.5"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 7208583168,
    "CFBundleShortVersionString" : "1.0",
    "CFBundleIdentifier" : "com.apple.UIKitMacHelper",
    "size" : 1167552,
    "uuid" : "a5f79014-5908-30e8-8bd2-e3bceb891202",
    "path" : "\/System\/Library\/PrivateFrameworks\/UIKitMacHelper.framework\/Versions\/A\/UIKitMacHelper",
    "name" : "UIKitMacHelper",
    "CFBundleVersion" : "8506"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6745440256,
    "size" : 636112,
    "uuid" : "9cf0401a-a938-389e-a77d-9e9608076ccf",
    "path" : "\/usr\/lib\/dyld",
    "name" : "dyld"
  },
  {
    "size" : 0,
    "source" : "A",
    "base" : 0,
    "uuid" : "00000000-0000-0000-0000-000000000000"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6746402816,
    "size" : 112640,
    "uuid" : "c8ed43c4-c077-34e9-ab26-f34231c895be",
    "path" : "\/usr\/lib\/system\/libsystem_trace.dylib",
    "name" : "libsystem_trace.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6746095616,
    "size" : 305408,
    "uuid" : "3b8ae373-80d2-36a4-a628-0cf6cf083703",
    "path" : "\/usr\/lib\/system\/libxpc.dylib",
    "name" : "libxpc.dylib"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6896685056,
    "CFBundleShortVersionString" : "15.5",
    "CFBundleIdentifier" : "com.apple.Metadata",
    "size" : 565568,
    "uuid" : "713fb6e3-7d7e-309f-b0db-18cd679c93a8",
    "path" : "\/System\/Library\/Frameworks\/CoreServices.framework\/Versions\/A\/Frameworks\/Metadata.framework\/Versions\/A\/Metadata",
    "name" : "Metadata",
    "CFBundleVersion" : "2333.50.1"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6811209728,
    "CFBundleShortVersionString" : "1333",
    "CFBundleIdentifier" : "com.apple.CoreServices.CarbonCore",
    "size" : 3091648,
    "uuid" : "6434a7be-a5cd-3df4-ba18-4d1359333044",
    "path" : "\/System\/Library\/Frameworks\/CoreServices.framework\/Versions\/A\/Frameworks\/CarbonCore.framework\/Versions\/A\/CarbonCore",
    "name" : "CarbonCore",
    "CFBundleVersion" : "1333"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6845358080,
    "CFBundleShortVersionString" : "1.0",
    "CFBundleIdentifier" : "com.apple.CFNetwork",
    "size" : 3973568,
    "uuid" : "c2fd723b-4e94-3d53-97dd-6bf958117f98",
    "path" : "\/System\/Library\/Frameworks\/CFNetwork.framework\/Versions\/A\/CFNetwork",
    "name" : "CFNetwork",
    "CFBundleVersion" : "3826.500.131"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 7675719680,
    "CFBundleShortVersionString" : "1.0.0",
    "CFBundleIdentifier" : "com.apple.texttospeech",
    "size" : 2273536,
    "uuid" : "2e7f826e-d72c-336f-bd30-2a9fc96a341a",
    "path" : "\/System\/Library\/PrivateFrameworks\/TextToSpeech.framework\/Versions\/A\/TextToSpeech",
    "name" : "TextToSpeech",
    "CFBundleVersion" : "1.0"
  },
  {
    "source" : "P",
    "arch" : "arm64e",
    "base" : 6864924672,
    "CFBundleShortVersionString" : "1.22",
    "CFBundleIdentifier" : "com.apple.HIServices",
    "size" : 443296,
    "uuid" : "9f96148e-f999-34d5-a7d6-bb6d8c75dae1",
    "path" : "\/System\/Library\/Frameworks\/ApplicationServices.framework\/Versions\/A\/Frameworks\/HIServices.framework\/Versions\/A\/HIServices",
    "name" : "HIServices"
  }
],
  "sharedCache" : {
  "base" : 6744604672,
  "size" : 5047205888,
  "uuid" : "d7397d7f-8df9-3920-81a7-c0a144be9c51"
},
  "vmSummary" : "ReadOnly portion of Libraries: Total=1.7G resident=0K(0%) swapped_out_or_unallocated=1.7G(100%)\nWritable regions: Total=6.1G written=1988K(0%) resident=1060K(0%) swapped_out=22.8M(0%) unallocated=6.1G(100%)\n\n                                VIRTUAL   REGION \nREGION TYPE                        SIZE    COUNT (non-coalesced) \n===========                     =======  ======= \nAccelerate framework               384K        3 \nActivity Tracing                   256K        1 \nCG image                           176K       10 \nCG raster data                    5312K      145 \nColorSync                          608K       30 \nCoreAnimation                     14.7M      458 \nCoreData                            64K        2 \nCoreData Object IDs               4112K        2 \nCoreGraphics                        32K        2 \nCoreUI image data                 3248K       23 \nFoundation                          64K        2 \nImage IO                          26.2M      284 \nKernel Alloc Once                   32K        1 \nMALLOC                             1.7G      105 \nMALLOC guard page                  384K       24 \nMach message                        32K        2 \nMemory Tag 241                      32K        1 \nSQLite page cache                 11.6M       93 \nSTACK GUARD                       56.5M       32 \nStack                             24.5M       33 \nVM_ALLOCATE                      128.9M       18 \nVM_ALLOCATE (reserved)             3.9G        1         reserved VM address space (unallocated)\nWebKit Malloc                    331.1M       31 \n__AUTH                            6194K      769 \n__AUTH_CONST                      79.9M     1001 \n__CTF                               824        1 \n__DATA                            27.4M     1003 \n__DATA_CONST                      29.8M     1033 \n__DATA_DIRTY                      2746K      339 \n__FONT_DATA                        2352        1 \n__INFO_FILTER                         8        1 \n__LINKEDIT                       621.1M       27 \n__OBJC_RO                         61.4M        1 \n__OBJC_RW                         2396K        1 \n__TEXT                             1.1G     1056 \n__TPRO_CONST                       128K        2 \ndyld private memory                128K        1 \nlibnetwork                        1664K       24 \nmapped file                      448.4M      238 \npage table in kernel              1060K        1 \nshared memory                      944K       19 \n===========                     =======  ======= \nTOTAL                              8.5G     6821 \nTOTAL, minus reserved VM space     4.6G     6821 \n",
  "legacyInfo" : {
  "threadTriggered" : {
    "queue" : "com.apple.main-thread"
  }
},
  "logWritingSignature" : "f1b5b84232d4aaa5925c5e01eeef548b2cf5686b",
  "trialInfo" : {
  "rollouts" : [
    {
      "rolloutId" : "6410af69ed1e1e7ab93ed169",
      "factorPackIds" : {

      },
      "deploymentId" : 240000011
    },
    {
      "rolloutId" : "60da5e84ab0ca017dace9abf",
      "factorPackIds" : {

      },
      "deploymentId" : 240000008
    }
  ],
  "experiments" : [
    {
      "treatmentId" : "28060e10-d4e5-4163-aa2b-d8bd088d5cbf",
      "experimentId" : "6685b283afc7c17197d69eec",
      "deploymentId" : 400000012
    }
  ]
}
}

Model: MacBookPro17,1, BootROM 11881.121.1, proc 8:4:4 processors, 16 GB, SMC 
Graphics: Apple M1, Apple M1, Built-In
Display: Color LCD, 2560 x 1600 Retina, Main, MirrorOff, Online
Memory Module: LPDDR4, Hynix
AirPort: spairport_wireless_card_type_wifi (0x14E4, 0x4378), wl0: Dec  7 2024 04:41:25 version 18.90.5.0.7.8.177 FWID 01-02f4dc53
IO80211_driverkit-1475.39 "IO80211_driverkit-1475.39" Apr 18 2025 20:10:40
AirPort: 
Bluetooth: Version (null), 0 services, 0 devices, 0 incoming serial ports
Network Service: Wi-Fi, AirPort, en0
USB Device: USB31Bus
USB Device: USB31Bus
Thunderbolt Bus: MacBook Pro, Apple Inc.
Thunderbolt Bus: MacBook Pro, Apple Inc.
