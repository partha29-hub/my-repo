import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Calendar, Plus, Star } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { WatchedAsteroids, NearEarthObjects } from '@/entities';
import { useMember } from '@/integrations';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function WatchlistPage() {
  const { member } = useMember();
  const [watchedItems, setWatchedItems] = useState<WatchedAsteroids[]>([]);
  const [neos, setNeos] = useState<Record<string, NearEarthObjects>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, [member]);

  const loadWatchlist = async () => {
    setIsLoading(true);
    
    const result = await BaseCrudService.getAll<WatchedAsteroids>('watchedasteroids');
    const userWatched = result.items.filter(item => item.userId === member?._id);
    setWatchedItems(userWatched);

    const neoIds = [...new Set(userWatched.map(item => item.neoId).filter(Boolean))];
    const neoData: Record<string, NearEarthObjects> = {};
    
    for (const neoId of neoIds) {
      const neo = await BaseCrudService.getById<NearEarthObjects>('nearearthobjects', neoId!);
      if (neo) {
        neoData[neoId!] = neo;
      }
    }
    
    setNeos(neoData);
    setIsLoading(false);
  };

  const removeFromWatchlist = async (watchId: string) => {
    setWatchedItems(prev => prev.filter(item => item._id !== watchId));
    await BaseCrudService.delete('watchedasteroids', watchId);
  };

  const toggleAlerts = async (watchId: string, currentState: boolean) => {
    setWatchedItems(prev => prev.map(item => 
      item._id === watchId ? { ...item, customAlertsEnabled: !currentState } : item
    ));
    await BaseCrudService.update<WatchedAsteroids>('watchedasteroids', {
      _id: watchId,
      customAlertsEnabled: !currentState
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 px-8 md:px-16">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Star className="w-12 h-12 text-accentcyan" />
                <h1 className="font-heading text-5xl md:text-6xl">
                  Your Watchlist
                </h1>
              </div>
              <p className="font-paragraph text-lg max-w-3xl opacity-90">
                Monitor your selected Near-Earth Objects and receive custom alerts for upcoming close approaches.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Watchlist Content */}
        <section className="py-16 px-8 md:px-16 bg-secondary">
          <div className="max-w-[100rem] mx-auto min-h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : watchedItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <Star className="w-20 h-20 text-secondary-foreground opacity-30 mx-auto mb-6" />
                <h2 className="font-heading text-3xl text-secondary-foreground mb-4">
                  Your Watchlist is Empty
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground opacity-70 mb-8 max-w-2xl mx-auto">
                  Start tracking Near-Earth Objects by adding them to your watchlist from the dashboard. 
                  You'll receive alerts for upcoming close approaches.
                </p>
                <Link to="/dashboard">
                  <button className="bg-accentcyan text-primary font-paragraph text-base px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Browse Asteroids
                  </button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {watchedItems.map((watched, index) => {
                  const neo = neos[watched.neoId || ''];
                  if (!neo) return null;

                  return (
                    <motion.div
                      key={watched._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-primary text-primary-foreground rounded-lg overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Section */}
                        <div className="relative h-64 lg:h-auto">
                          <Image 
                            src="https://static.wixstatic.com/media/21621a_d8782b316d9e41639cba9c9a35694f23~mv2.png?originWidth=384&originHeight=256"
                            alt={neo.name || 'Asteroid'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-darkgrayoverlay opacity-60"></div>
                          {neo.isHazardous && (
                            <div className="absolute top-4 left-4 bg-destructive text-destructiveforeground px-3 py-2 rounded-full flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-paragraph text-sm font-semibold">Hazardous</span>
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="lg:col-span-2 p-6 lg:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                            <div>
                              <Link to={`/neo/${neo._id}`}>
                                <h3 className="font-heading text-3xl text-accentcyan hover:opacity-80 transition-opacity mb-2">
                                  {neo.name || 'Unknown'}
                                </h3>
                              </Link>
                              <p className="font-paragraph text-sm opacity-70">
                                ID: {neo.referenceId || 'N/A'}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => removeFromWatchlist(watched._id)}
                              className="self-start lg:self-auto bg-destructive text-destructiveforeground px-4 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="font-paragraph text-sm font-semibold">Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="font-heading text-lg mb-3">Risk Analysis</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-paragraph text-sm opacity-80">Risk Score:</span>
                                  <span className="font-heading text-lg text-accentcyan">
                                    {neo.riskScore?.toFixed(1) || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-paragraph text-sm opacity-80">Miss Distance:</span>
                                  <span className="font-paragraph text-sm">
                                    {neo.missDistance ? `${(neo.missDistance / 1000000).toFixed(2)}M km` : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-paragraph text-sm opacity-80">Velocity:</span>
                                  <span className="font-paragraph text-sm">
                                    {neo.relativeVelocity ? `${neo.relativeVelocity.toFixed(0)} km/h` : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-heading text-lg mb-3">Tracking Info</h4>
                              <div className="space-y-2">
                                {neo.nextCloseApproachDatetime && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-accentcyan" />
                                    <span className="font-paragraph text-sm">
                                      {format(new Date(neo.nextCloseApproachDatetime), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                )}
                                {watched.addedDate && (
                                  <div className="flex justify-between items-center">
                                    <span className="font-paragraph text-sm opacity-80">Added:</span>
                                    <span className="font-paragraph text-sm">
                                      {format(new Date(watched.addedDate), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Alerts Toggle */}
                          <div className="pt-4 border-t border-primary-foreground border-opacity-20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-heading text-lg mb-1">Custom Alerts</h4>
                                <p className="font-paragraph text-sm opacity-70">
                                  Receive notifications for close approaches
                                </p>
                              </div>
                              <button
                                onClick={() => toggleAlerts(watched._id, watched.customAlertsEnabled || false)}
                                className={`px-6 py-2 rounded-full font-paragraph text-sm font-semibold transition-all ${
                                  watched.customAlertsEnabled
                                    ? 'bg-accentcyan text-primary'
                                    : 'bg-transparent border-2 border-accentcyan text-accentcyan'
                                }`}
                              >
                                {watched.customAlertsEnabled ? 'Enabled' : 'Disabled'}
                              </button>
                            </div>
                          </div>

                          {/* User Notes */}
                          {watched.userNotes && (
                            <div className="mt-4 pt-4 border-t border-primary-foreground border-opacity-20">
                              <h4 className="font-heading text-lg mb-2">Notes</h4>
                              <p className="font-paragraph text-sm opacity-80 leading-relaxed">
                                {watched.userNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
