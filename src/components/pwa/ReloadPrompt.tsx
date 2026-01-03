import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { X } from '@phosphor-icons/react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex-1 text-sm">
          {offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>New content available, click reload to update.</span>
          )}
        </div>
        {needRefresh && (
          <Button size="sm" onClick={() => updateServiceWorker(true)}>
            Reload
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={close}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
